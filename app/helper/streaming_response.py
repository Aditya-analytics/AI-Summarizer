from app.helper.dynamic_prompt import tweak_prompt
from app.services.llm_service import llm_response
from app.config import MODEL_NAME, SYSTEM_PROMPT
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from sqlalchemy.ext.asyncio import AsyncSession
from app.data.models import Output

async def streaming_output(text:str,length:str,language:str, document_id: int = None, db: AsyncSession = None):
    prompt = tweak_prompt(SYSTEM_PROMPT,length,language)
    query = f"{prompt}\n{text}" 
    try :
        async def stream_generator():
            full_summary = []
            async for chunk in llm_response(query, MODEL_NAME):
                full_summary.append(chunk)
                yield chunk
            
            # Caching logic
            if document_id and db:
                summary_text = "".join(full_summary)
                new_cache = Output(
                    document_id=document_id,
                    summary=summary_text,
                    style=length,
                    language=language
                )
                db.add(new_cache)
                await db.commit()
            
        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

