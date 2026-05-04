import asyncio
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma

from app.helper.dynamic_embeddings import get_embeddings_for_user

async def get_context_from_db(query:str, document_id:int, vectorstore, k:int=3, api_key: str = None, embeddings_model: str = None, db_session=None) -> list:
    """Retrieves relevant context from the provided vectorstore singleton using a dynamic embedding key/model.
       Includes a lazy re-indexing fallback if vectors are missing from the local store.
    """
    embeddings = get_embeddings_for_user(api_key, embeddings_model)
    db = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )
    
    loop = asyncio.get_running_loop()

    # 1. Primary Search
    results = await loop.run_in_executor(
        None,
        lambda: db.similarity_search_with_score(
            query,
            k=k,
            filter={"document_id": document_id}
        )
    )
    
    # 2. Lazy Re-indexing Fallback
    # If no results and we have a db_session, try to re-index from SQL source
    if not results and db_session:
        from app.data.models import Document
        from sqlalchemy import select
        from sqlalchemy.orm import joinedload
        from app.helper.chunk import process_chunk
        from app.helper.embed import store_chunks

        # Fetch doc content from SQL
        res = await db_session.execute(
            select(Document).options(joinedload(Document.content_blob)).where(Document.id == document_id)
        )
        doc = res.scalar_one_or_none()
        
        if doc and doc.content_blob and doc.content_blob.raw_text:
            print(f"LOG: Vectors missing for doc {document_id}. Triggering lazy re-indexing...")
            chunks = await process_chunk(doc.content_blob.raw_text)
            await store_chunks(chunks, document_id, api_key=api_key, model=embeddings_model)
            
            # Search again after re-indexing
            results = await loop.run_in_executor(
                None,
                lambda: db.similarity_search_with_score(
                    query,
                    k=k,
                    filter={"document_id": document_id}
                )
            )

    content = "\n\n".join([doc.page_content for doc, score in results])
    scores = [score for doc, score in results]
    return content, scores

def generate_qa_prompt(question: str, context: str) -> str:
    prompt = f"""# IDENTITY
You are Nova, an elite research assistant. Your goal is to provide precise, high-fidelity, and analytically grounded answers based on the provided context.

# CONTEXT CONTENT
{context}

# USER QUESTION
{question}

# OUTPUT SPECIFICATIONS & RESTRICTIONS
1. **Source Grounding**: Answer using ONLY the provided context. If the answer isn't in the context, state: "The current documentation does not contain information regarding this specific inquiry."
2. **Elegant Formatting**: Use high-fidelity markdown:
   - Use `###` for section headers if the answer is long.
   - Use **bolding** for critical technical terms or data points.
   - Use clean, bulleted lists for multi-part explanations.
3. **Strategic Takeaways**: If the answer involves complex logic, provide a "Key Takeaway" bolded at the end.
4. **Tone**: Maintain a sophisticated, professional, and helpful tone. Avoid conversational filler.
"""
    return prompt