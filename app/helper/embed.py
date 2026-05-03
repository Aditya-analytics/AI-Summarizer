import asyncio
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from app.config import GEMINI_API_KEY

async def store_chunks(chunks: list[str], document_id):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2", google_api_key=GEMINI_API_KEY)
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

    