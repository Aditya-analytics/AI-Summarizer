import asyncio
import json
from fastapi.responses import StreamingResponse
from app.services.pipeline import ingest_pipeline

async def stream_ingestion_progress(text: str, document_id: int, api_key=None, model=None):
    """
    Streams the progress of document ingestion (parsing, chunking, embedding).
    Does NOT generate a summary.
    """
    async def progress_generator():
        try:
            yield "Document metadata saved to library...\n"
            await asyncio.sleep(0.5)
            
            yield "Extracting and cleaning text content...\n"
            await asyncio.sleep(0.5)
            
            yield "Chunking content for intelligent retrieval...\n"
            # We can actually call the pipeline logic here step-by-step or just use the pipeline
            # For now, let's just wrap the pipeline and pretend it's streaming steps
            from app.helper.chunk import process_chunk
            from app.helper.embed import store_chunks
            
            chunks = await process_chunk(text)
            yield f"Created {len(chunks)} contextual chunks...\n"
            await asyncio.sleep(0.3)
            
            yield "Generating vector embeddings for RAG...\n"
            await store_chunks(chunks, document_id, api_key=api_key, model=model)
            await asyncio.sleep(0.3)
            
            yield "Nova intelligence processing complete!\n"
            yield "[DONE]\n" # Signal for frontend to finish
            
        except Exception as e:
            yield f"Error during processing: {str(e)}\n"
            yield "[ERROR]\n"

    return StreamingResponse(progress_generator(), media_type="text/plain")
