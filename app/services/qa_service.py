import asyncio
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma

async def get_context_from_db(query:str, document_id:int, vectorstore, k:int=3) -> list:
    """Retrieves relevant context from the provided vectorstore singleton."""
    loop = asyncio.get_running_loop()
    results = await loop.run_in_executor(
        None,
        lambda: vectorstore.similarity_search_with_score(
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
You are Nova, an elite research assistant. Your goal is to provide precise, helpful, and analytically grounded answers based on the provided context.

# CONTEXT CONTENT
{context}

# USER QUESTION
{question}

# INSTRUCTIONS
1. **Source Grounding**: Answer the question using ONLY the provided context. Do not use outside knowledge.
2. **Precision**: Be direct and concise. If the answer isn't in the context, state clearly that the information is not available in the current document.
3. **Tone**: Maintain a professional, polite, and helpful tone.
4. **Formatting**: Use clean markdown (bolding, lists) to improve readability if the answer is complex.
"""
    return prompt