import asyncio
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma

async def store_chunks(chunks: list[str],document_id):
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    metadatase = [{"document_id":document_id} for _ in chunks]
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

    