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
    from starlette.middleware.base import BaseHTTPMiddleware
    
    # Custom Middleware to handle prefix-based CORS
    class DynamicCORSMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request, call_next):
            origin = request.headers.get("origin")
            
            # Handle Preflight (OPTIONS) requests
            if request.method == "OPTIONS":
                response = Response(status_code=204)
                if self._is_allowed(origin):
                    self._apply_cors_headers(response, origin)
                return response
            
            response = await call_next(request)
            if self._is_allowed(origin):
                self._apply_cors_headers(response, origin)
            return response

        def _is_allowed(self, origin: str) -> bool:
            if not origin: return False
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            allowed_prefixes = [p.strip() for p in frontend_url.split(",")]
            # Always allow local dev
            if "http://localhost:5173" not in allowed_prefixes:
                allowed_prefixes.append("http://localhost:5173")
            return any(origin.startswith(p) for p in allowed_prefixes)

        def _apply_cors_headers(self, response, origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
            response.headers["Access-Control-Expose-Headers"] = "Content-Length, Content-Range"

    from starlette.responses import Response
    app.add_middleware(DynamicCORSMiddleware)
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
