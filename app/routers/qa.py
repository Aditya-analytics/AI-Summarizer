from app.data.models import QAHistory
from app.schemas import BasicConfigs
from app.schemas import QuizConfig
from app.services.notes_service import generate_notes_prompt
from app.helper.auth import get_current_user
from app.data.models import Document
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.services.llm_service import llm_response
from app.services.qa_service import generate_qa_prompt
from app.services.qa_service import get_context_from_db
from fastapi import APIRouter, HTTPException, Request
from app.config import MODEL_NAME
from fastapi.responses import StreamingResponse
from app.schemas import QA
import json
from app.data.database import get_db
from app.data.models import Output

qa_router = APIRouter(
    prefix="/qa",
    tags=["features"]
)

@qa_router.get("/document/{document_id}/artifacts", status_code=200)
async def get_all_artifacts(document_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    """Fetches all existing artifacts and chat history for rehydration."""
    # 1. Ownership check
    result = await db.execute(
        select(Document).where(Document.id == document_id, Document.user_id == current_user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Document not found")

    # 2. Fetch latest outputs (Summary, Notes, Quiz)
    out_result = await db.execute(
        select(Output).where(Output.document_id == document_id).order_by(Output.id.desc())
    )
    outputs = out_result.scalars().all()
    
    # 3. Fetch Chat History
    chat_result = await db.execute(
        select(QAHistory).where(QAHistory.document_id == document_id).order_by(QAHistory.id.asc())
    )
    history = chat_result.scalars().all()

    # Organize artifacts by type (taking latest for each)
    summary = next((o.summary for o in outputs if o.summary), None)
    notes = next((o.notes for o in outputs if o.notes), None)
    
    quiz = None
    quiz_raw = next((o.quiz for o in outputs if o.quiz), None)
    if quiz_raw:
        try:
            quiz = json.loads(quiz_raw)
        except:
            quiz = None

    chat = []
    for h in history:
        chat.append({"role": "user", "content": h.question})
        chat.append({"role": "ai", "content": h.answer})

    return {
        "summary": summary,
        "notes": notes,
        "quiz": quiz,
        "chat": chat
    }

@qa_router.delete("/document/{document_id}/chat", status_code=204)
async def clear_chat(document_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    """Clears all chat history for a given document."""
    # Ownership check
    result = await db.execute(
        select(Document).where(Document.id == document_id, Document.user_id == current_user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Document not found")

    from sqlalchemy import delete
    await db.execute(delete(QAHistory).where(QAHistory.document_id == document_id))
    await db.commit()
    return None

@qa_router.get("/document/{document_id}/raw", status_code=200)
async def get_raw_text(document_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(
        select(Document)
        .options(joinedload(Document.content_blob))
        .where(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    
    raw_text = doc.content_blob.raw_text if doc.content_blob else ""
    return {"raw_text": raw_text}

# ── Summary ───────────────────────────────────────────────────────────────────
from app.helper.streaming_response import streaming_output

@qa_router.post("/summary", status_code=200)
async def get_summary(config: BasicConfigs, document_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(
        select(Document)
        .options(joinedload(Document.content_blob))
        .where(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    
    # 1. CACHE CHECK
    result = await db.execute(
        select(Output.summary).where(
            Output.document_id == document_id,
            Output.style == config.length,
            Output.language == config.language
        ).order_by(Output.id.desc())
    )
    cache = result.scalars().first()
    if cache:
        return cache
        
    # 2. GENERATE NEW SUMMARY
    from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
    creds = await get_gauntlet_credentials(current_user, db)
    
    raw_text = doc.content_blob.raw_text if doc.content_blob else ""
    response = await streaming_output(
        raw_text, config.length, config.language, 
        document_id=document_id, db=db,
        model=creds["engine_model"],
        api_key=creds["api_key"]
    )

    if creds["is_free"]:
        await consume_free_call(current_user, db)
    
    return response


@qa_router.post("/ask",status_code=200)
async def ask(user_input: QA, request: Request, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(
        select(Document).where(
            Document.id == user_input.document_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()

    if not doc :
        raise HTTPException(status_code=404,detail="Document not found or access denied")

    from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
    creds = await get_gauntlet_credentials(current_user, db)

    context, scores = await get_context_from_db(user_input.question, user_input.document_id, request.app.state.vector_db, api_key=creds["api_key"], embeddings_model=creds["embeddings_model"], db_session=db)
    prompt = generate_qa_prompt(user_input.question,context)
    full_answer = []
    try :
        async def stream_generator():
            async for chunk in llm_response(prompt, creds["engine_model"], creds["api_key"]):
                full_answer.append(chunk)
                yield chunk
            
            response = "".join(full_answer)
            hist = QAHistory(
                question=user_input.question,
                document_id=user_input.document_id,
                answer=response
            )
            db.add(hist)
            
            # Decrement free calls only on success
            if creds["is_free"]:
                await consume_free_call(current_user, db)
                
            await db.commit()
            await db.refresh(hist)

        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@qa_router.post("/quiz",status_code=200)
async def get_quizes(config: QuizConfig, document_id: int, request: Request, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):

    result = await db.execute(
        select(Document)
        .options(joinedload(Document.content_blob))  # Load raw_text eagerly
        .where(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    if not doc :
        raise HTTPException(status_code=404,detail="Document not found or access denied")

    # 1. CACHE CHECK
    result = await db.execute(
        select(Output.quiz).where(
            Output.document_id == document_id,
            Output.difficulty == config.difficulty
        ).order_by(Output.id.desc())
    )
    cache = result.scalars().first()
    if cache:
        try:
            return json.loads(cache)
        except Exception as e:
            print(f"LOG: Corrupted quiz cache for doc {document_id}: {e}")
            # Continue to generation if cache is corrupted

    # 2. AI GENERATION
    from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
    creds = await get_gauntlet_credentials(current_user, db)

    from app.services.quiz_service import generate_quiz_stream
    quiz_query = f"key concepts and important facts for a {config.difficulty} difficulty quiz"
    context, scores = await get_context_from_db(quiz_query, document_id, request.app.state.vector_db, k=15, api_key=creds["api_key"], embeddings_model=creds["embeddings_model"], db_session=db)
    
    if not context or not context.strip():
        raise HTTPException(status_code=503, detail="Document is still being indexed.")

    full_quiz_json = []
    async def stream_quiz():
        async for chunk in generate_quiz_stream(context, config.difficulty, model=creds["engine_model"], api_key=creds["api_key"]):
            full_quiz_json.append(chunk)
            yield chunk
        
        # 3. SAVE CACHE (after stream ends)
        try:
            quiz_str = "".join(full_quiz_json)
            if "questions" in quiz_str and "]" in quiz_str:
                new_cache = Output(
                    document_id=document_id,
                    quiz=quiz_str,
                    difficulty=config.difficulty,
                    style="quiz",
                    language="English"
                )
                db.add(new_cache)
                
                # Decrement free calls
                if creds["is_free"]:
                    await consume_free_call(current_user, db)

                await db.commit()
        except Exception as e:
            print(f"LOG: Failed to cache quiz: {e}")

    return StreamingResponse(stream_quiz(), media_type="text/plain")

@qa_router.post("/notes",status_code=200)
async def get_notes(config: BasicConfigs, document_id: int, request: Request, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(
        select(Document)
        .options(joinedload(Document.content_blob))  # Load raw_text eagerly
        .where(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()
    if not doc :
        raise HTTPException(status_code=404,detail="Document not found or access denied")
    
    # 1. CACHE CHECK
    result = await db.execute(
        select(Output.notes).where(
            Output.document_id == document_id,
            Output.style == config.length,
            Output.language == config.language
        )
    )
    cache = result.scalar_one_or_none()
    if cache:
        return cache

    # 2. AI GENERATION
    from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
    creds = await get_gauntlet_credentials(current_user, db)

    raw_text = doc.content_blob.raw_text if doc.content_blob else ""
    # raw_text only used for k calculation — NOT as the query (would exceed context limit)
    k = max(3, min(20, len(raw_text) // 1000))
    notes_query = f"key concepts, main ideas, summary, and important details for {config.length} notes"
    context, scores = await get_context_from_db(notes_query, document_id, request.app.state.vector_db, k=k, api_key=creds["api_key"], embeddings_model=creds["embeddings_model"], db_session=db)

    # Guard: if no vectors exist yet, the document is still being indexed
    if not context or not context.strip():
        raise HTTPException(
            status_code=503,
            detail="Document is still being indexed. Please wait a moment and try again."
        )

    prompt = generate_notes_prompt(context, config.length)

    notes = []
    try :
        async def stream_generator():
            async for chunk in llm_response(prompt, creds["engine_model"], creds["api_key"]):
                notes.append(chunk)
                yield chunk
            
            # 3. SAVE CACHE (Inside generator after completion)
            response = "".join(notes)
            new_cache = Output(
                document_id=document_id,
                notes=response,
                style=config.length,
                language=config.language
            )
            db.add(new_cache)
            
            # Decrement free calls
            if creds["is_free"]:
                await consume_free_call(current_user, db)

            await db.commit()
            
        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

    

