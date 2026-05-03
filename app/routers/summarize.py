from sqlalchemy.exc import IntegrityError
from app.data.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.helper.auth import get_current_user
from fastapi import Depends
from app.services.pipeline import ingest_pipeline
from app.helper.pdf_handler import InvalidPDFError
from app.helper.youtube_id_extract import INVALID_URL
from fastapi import APIRouter,HTTPException,File,UploadFile,BackgroundTasks
from app.schemas import Prompt,Scrape,Transcribe
from app.services.scraper_service import scrape_url
from app.helper.ingest_streaming import stream_ingestion_progress
from app.helper.pdf_handler import extract_pdf_text
from app.services.youtube_service import get_transcript
from app.data.models import Document,DocumentContent,Output
from fastapi import Form
from sqlalchemy import select

router = APIRouter(prefix="/summarization",tags=["llm"])

# ── List Documents ────────────────────────────────────────────────────────────
@router.get("/documents", status_code=200)
async def get_documents(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Returns all documents owned by the current user with efficient artifact flags."""
    from sqlalchemy import exists

    # 1. Fetch documents
    result = await db.execute(
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()
    
    response = []
    for d in docs:
        # 2. Efficiently check for artifacts using EXISTS
        artifacts = []
        
        # Check summary
        summary_exists = await db.scalar(
            select(exists().where(Output.document_id == d.id, Output.summary.isnot(None)))
        )
        if summary_exists: artifacts.append('summary')
        
        # Check notes
        notes_exists = await db.scalar(
            select(exists().where(Output.document_id == d.id, Output.notes.isnot(None)))
        )
        if notes_exists: artifacts.append('notes')
        
        # Check quiz
        quiz_exists = await db.scalar(
            select(exists().where(Output.document_id == d.id, Output.quiz.isnot(None)))
        )
        if quiz_exists: artifacts.append('quiz')
        
        response.append({
            "id": d.id,
            "name": d.name, # Use the name field
            "type": d.type,
            "created_at": str(d.created_at),
            "artifacts": artifacts,
            "has_summary": summary_exists > 0,
            "has_notes": notes_exists > 0,
            "has_quiz": quiz_exists > 0
        })
    return response


async def _get_or_create_doc(source: str, doc_type: str, text: str,
                              user_id: int, db: AsyncSession,
                              doc_name: str = None, # Added doc_name
                              length: str = None, language: str = None,
                              bgt: BackgroundTasks = None):
    """Finds or creates a Document. Returns (doc_id, cached_summary_or_None)."""
    result = await db.execute(
        select(Document).where(
            Document.source == source,
            Document.user_id == user_id
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        # Check for a matching cached summary
        if length and language:
            cache_result = await db.execute(
                select(Output.summary).where(
                    Output.document_id == existing.id,
                    Output.style == length,
                    Output.language == language
                )
            )
            cached = cache_result.scalar_one_or_none()
            return existing.id, cached  # cached may be None
        return existing.id, None

    # Fallback name logic
    final_name = doc_name or source

    new_doc = Document(
        type=doc_type, 
        source=source, 
        user_id=user_id,
        name=final_name # Set the name
    )
    new_doc.content_blob = DocumentContent(raw_text=text)
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)

    return new_doc.id, None  # Brand new doc — no cache yet


# ── Text ──────────────────────────────────────────────────────────────────────
@router.post("/text", status_code=200)
async def summarize(
    user_input: Prompt,
    bgt: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        import hashlib
        source_key = f"text_{hashlib.sha256(user_input.text.encode()).hexdigest()[:32]}"
        doc_id, cache = await _get_or_create_doc(
            source_key, "TEXT", user_input.text, current_user.id, db,
            doc_name=user_input.doc_name, # Pass doc_name
            length=user_input.length, language=user_input.language, bgt=bgt
        )
        if cache:
            return "Content already processed. Access via library."
        
        from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
        creds = await get_gauntlet_credentials(current_user, db)
        
        response = await stream_ingestion_progress(
            user_input.text, doc_id, 
            api_key=creds["api_key"], 
            model=creds["embeddings_model"]
        )

        if creds["is_free"]:
            await consume_free_call(current_user, db)
        
        return response
    except Exception as e:
        print(f"SUMMARIZE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ingestion Failed: {str(e)}")


# ── URL ───────────────────────────────────────────────────────────────────────
@router.post("/url")
async def summarize_url(
    user_input: Scrape,
    bgt: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        text = await scrape_url(user_input.url)
        doc_id, cache = await _get_or_create_doc(
            user_input.url, "URL", text, current_user.id, db,
            doc_name=user_input.doc_name, # Pass doc_name
            length=user_input.length, language=user_input.language, bgt=bgt
        )
        if cache:
            return "Content already processed. Access via library."
        
        from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
        creds = await get_gauntlet_credentials(current_user, db)

        response = await stream_ingestion_progress(
            text, doc_id, 
            api_key=creds["api_key"], 
            model=creds["embeddings_model"]
        )

        if creds["is_free"]:
            await consume_free_call(current_user, db)
        
        return response
    except Exception as e:
        print(f"SCRAPE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Web Ingestion Failed: {str(e)}")


# ── YouTube ───────────────────────────────────────────────────────────────────
@router.post("/youtube_url")
async def yt_summarize(
    user_input: Transcribe,
    bgt: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        text = await get_transcript(user_input.url)
        doc_id, cache = await _get_or_create_doc(
            user_input.url, "YOUTUBE", text, current_user.id, db,
            doc_name=user_input.doc_name, # Pass doc_name
            length=user_input.length, language=user_input.language, bgt=bgt
        )
        if cache:
            return "Content already processed. Access via library."
        
        from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
        creds = await get_gauntlet_credentials(current_user, db)

        response = await stream_ingestion_progress(
            text, doc_id, 
            api_key=creds["api_key"], 
            model=creds["embeddings_model"]
        )

        if creds["is_free"]:
            await consume_free_call(current_user, db)
        
        return response
    except INVALID_URL:
        raise HTTPException(status_code=400, detail="Invalid Url")

@router.post("/pdf")
async def summarize_pdf(
    bgt: BackgroundTasks,
    file: UploadFile = File(...),
    length: str = Form("standard"),
    language: str = Form("English"),
    doc_name: str = Form(None), # Added doc_name Form field
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400,detail="File must be pdf")

    try :
        text = await extract_pdf_text(file)
        doc_id, cache = await _get_or_create_doc(
            file.filename, "PDF", text, current_user.id, db,
            doc_name=doc_name, # Pass doc_name
            length=length, language=language, bgt=bgt
        )
        
        if cache:
            return "Content already processed. Access via library."
        
        from app.helper.gauntlet_helper import get_gauntlet_credentials, consume_free_call
        creds = await get_gauntlet_credentials(current_user, db)

        response = await stream_ingestion_progress(
            text, doc_id, 
            api_key=creds["api_key"], 
            model=creds["embeddings_model"]
        )

        if creds["is_free"]:
            await consume_free_call(current_user, db)
        
        return response

    except InvalidPDFError:
        raise HTTPException(status_code=400,detail="Uploaded document is not a pdf!")
    except IntegrityError:
        raise HTTPException(status_code=409,detail="File already uploaded")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# ── DELETE ────────────────────────────────────────────────────────────────────
@router.delete("/documents/{document_id}", status_code=200)
async def delete_document(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Deletes a document owned by the current user.
    CASCADE automatically removes: DocumentContent, Output, QAHistory.
    """
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.user_id == current_user.id   # Ownership check
        )
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found or access denied")

    from app.helper.embed import delete_vectors
    await delete_vectors(document_id)
    
    await db.delete(doc)   # One line wipes everything via CASCADE
    await db.commit()

    return {"message": f"Document {document_id} and all its data deleted successfully."}



    
    
    
    