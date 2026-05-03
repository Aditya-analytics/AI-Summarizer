import asyncio
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from app.config import GEMINI_API_KEY

async def store_chunks(chunks: list[str], document_id, api_key=None, model=None):
    """Generates embeddings using dynamic model/key and stores in Chroma."""
    target_api_key = api_key or GEMINI_API_KEY
    target_model = model or "models/gemini-embedding-2-preview" # Verified multimodal matrix
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model=target_model, 
        google_api_key=target_api_key
    )
    
    metadatase = [{"document_id": document_id} for _ in chunks]
    ids = [f"{document_id}_{i}" for i in range(len(chunks))]

    loop = asyncio.get_running_loop()
   
    vector_store = await loop.run_in_executor(
        None,
        lambda: Chroma.from_texts(
            texts=chunks,
            embedding=embeddings,
            metadatas=metadatase,
            ids=ids,
            persist_directory="./chroma_db"
        )
    ) 
    return vector_store

async def delete_vectors(document_id):
    """Deletes all vectors associated with a document_id from Chroma."""
    from langchain_chroma import Chroma
    from app.config import GEMINI_API_KEY
    from langchain_google_genai import GoogleGenerativeAIEmbeddings

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2-preview", google_api_key=GEMINI_API_KEY)
    
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(
        None,
        lambda: Chroma(
            persist_directory="./chroma_db",
            embedding_function=embeddings
        ).delete(where={"document_id": document_id})
    )
    print(f"LOG: Deleted vectors for document {document_id}")

    