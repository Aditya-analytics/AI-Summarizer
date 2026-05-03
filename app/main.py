import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.data.database import engine
from app.data.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Vector DB Singleton (Warm-up)
    print("LOG: Warming up Vector DB Singleton...")
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    from langchain_chroma import Chroma
    from app.config import GEMINI_API_KEY
    
    # Use the state-of-the-art default for system-level warm-up
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2-preview", google_api_key=GEMINI_API_KEY)
    vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
    
    app.state.vector_db = vectorstore
    print("LOG: Vector DB Singleton Warm-up Complete.")
    
    yield
    # Cleanup if needed

def create_app():
    from app.routers.qa import qa_router
    from app.routers.summarize import router
    from app.routers.auth import router as auth_router
    from app.routers.gauntlet import router as gauntlet_router
    
    app = FastAPI(title="AI Learning Workspace 🤖", lifespan=lifespan)
    
    import os
    from fastapi.middleware.cors import CORSMiddleware
    
    # Production Hardening: Allow local dev and any Vercel deployments for this project
    frontend_url = os.getenv("FRONTEND_URL", "https://project-v8wyz")
    # Clean up the prefix for regex use
    prefix = frontend_url.strip().replace("https://", "").replace("http://", "")
    
    # This regex matches the prefix exactly OR any subdomain/extension of it on vercel.app
    # e.g., https://project-v8wyz.vercel.app and https://project-v8wyz-git-v3...vercel.app
    origin_regex = rf"https?://{prefix}.*\.vercel\.app|https?://localhost:.*"
    
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)
    app.include_router(auth_router)
    app.include_router(qa_router)
    app.include_router(gauntlet_router)
    
    # Global Exception Handler
    from fastapi import Request
    from fastapi.responses import JSONResponse
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        print(f"CRITICAL ERROR: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Nova Intelligence encountered an unexpected anomaly. Our engineers are investigating.",
                "error": str(exc) if app.debug else "Internal Server Error"
            }
        )

    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:create_app",host="0.0.0.0",port=8000,reload=True,factory=True)
