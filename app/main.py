import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.data.database import engine
from app.data.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Vector DB Singleton
    print("LOG: Initializing Vector DB Singleton...")
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    from langchain_chroma import Chroma
    from app.config import GEMINI_API_KEY
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2", google_api_key=GEMINI_API_KEY)
    vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
    
    app.state.vector_db = vectorstore
    app.state.embeddings = embeddings
    print("LOG: Vector DB Ready with Gemini Embeddings.")
    
    yield
    # Cleanup if needed

def create_app():
    from app.routers.qa import qa_router
    from app.routers.summarize import router
    from app.routers.auth import router as auth_router
    
    app = FastAPI(title="AI Learning Workspace 🤖", lifespan=lifespan)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)
    app.include_router(auth_router)
    app.include_router(qa_router)

    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:create_app",host="0.0.0.0",port=8000,reload=True,factory=True)
