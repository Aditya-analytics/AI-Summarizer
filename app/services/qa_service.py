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
    role = " You are a helpful Q/A assistant with polite and freindly tone"
    rule = "You answer the question based only on provided context"
    fallback = "You must response to user clearly if you didn't found any relavent context"

    prompt = f"Role : {role}\nRule : {rule}\nHere's the question : {question}\nHere's the context : {context}\nImportant Fallback : {fallback}"

    return prompt 