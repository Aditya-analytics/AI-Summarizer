from app.data.models import QAHistory
from app.schemas import BasicConfigs
from app.schemas import QuizConfig
from app.services.notes_service import generate_notes_prompt
from app.services.quiz_service import generate_quiz
from app.helper.auth import get_current_user
from app.data.models import Document
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.services.llm_service import llm_response
from app.services.qa_service import generate_qa_prompt
from app.services.qa_service import get_context_from_db
from fastapi import APIRouter,HTTPException
from app.config import MODEL_NAME,OLLAMA_URL
from fastapi.responses import StreamingResponse
from app.schemas import QA
import json
from app.data.database import get_db
from app.data.models import Output

qa_router = APIRouter(
    prefix="/qa",
    tags=["features"]
)

# ── Raw Document Text ─────────────────────────────────────────────────────────
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
        )
    )
    cache = result.scalar_one_or_none()
    if cache:
        return cache
        
    # 2. GENERATE NEW SUMMARY
    raw_text = doc.content_blob.raw_text if doc.content_blob else ""
    return await streaming_output(raw_text, config.length, config.language, document_id=document_id, db=db)


@qa_router.post("/ask",status_code=200)
async def ask(user_input: QA,db: AsyncSession = Depends(get_db),current_user = Depends(get_current_user)):
    result = await db.execute(
        select(Document).where(
            Document.id == user_input.document_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalar_one_or_none()

    if not doc :
        raise HTTPException(status_code=404,detail="Document not found or access denied")

    context,scores = await get_context_from_db(user_input.question,user_input.document_id)
    prompt = generate_qa_prompt(user_input.question,context)
    full_answer = []
    try :
        async def stream_generator():
        # Loop over the generator from the service
            async for line in llm_response(prompt, MODEL_NAME, OLLAMA_URL):
            # Parse the JSON string into a dictionary
                chunk = json.loads(line)
                full_answer.append(chunk.get("response"))

            # Yield the final string to the browser
                yield chunk.get("response", "")
            response = "".join(full_answer)

            hist = QAHistory(
                    question=user_input.question,
                    document_id=user_input.document_id,
                    answer=response
                )
            db.add(hist)
            await db.commit()
            await db.refresh(hist)

        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@qa_router.post("/quiz",status_code=200)
async def get_quizes(config:QuizConfig,document_id : int,db: AsyncSession = Depends(get_db),current_user = Depends(get_current_user)):

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
        )
    )
    cache = result.scalar_one_or_none()
    if cache:
        return json.loads(cache)

    # 2. AI GENERATION
    # Use a focused query — NOT the full raw_text (would exceed embedding model's context)
    quiz_query = f"key concepts, definitions, and important facts for a {config.difficulty} difficulty quiz"
    context, scores = await get_context_from_db(quiz_query, document_id, k=10)

    # Guard: if no vectors exist yet, the document is still being indexed
    if not context or not context.strip():
        raise HTTPException(
            status_code=503,
            detail="Document is still being indexed. Please wait a moment and try again."
        )

    quizes = await generate_quiz(context, config.difficulty)
    if len(quizes.questions) == 0:
        raise HTTPException(status_code=411,detail="Provide more content to generate quizes")

    # 3. SAVE CACHE
    new_cache = Output(
        document_id=document_id,
        quiz=json.dumps(quizes.model_dump()),
        difficulty=config.difficulty,
        style="quiz",
        language="English"
    )
    db.add(new_cache)
    await db.commit()

    return quizes

@qa_router.post("/notes",status_code=200)
async def get_notes(config:BasicConfigs,document_id: int,db: AsyncSession = Depends(get_db),current_user = Depends(get_current_user)):
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
    raw_text = doc.content_blob.raw_text if doc.content_blob else ""
    # raw_text only used for k calculation — NOT as the query (would exceed context limit)
    k = max(3, min(20, len(raw_text) // 1000))
    notes_query = f"key concepts, main ideas, summary, and important details for {config.length} notes"
    context, scores = await get_context_from_db(notes_query, document_id, k=k)

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
            async for line in llm_response(prompt, MODEL_NAME, OLLAMA_URL):
                chunk = json.loads(line)
                notes.append(chunk.get("response"))
                yield chunk.get("response", "")
            
            # 3. SAVE CACHE (Inside generator after completion)
            response = "".join(notes)
            new_cache = Output(
                document_id=document_id,
                notes=response,
                style=config.length,
                language=config.language
            )
            db.add(new_cache)
            await db.commit()
            
        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

    

