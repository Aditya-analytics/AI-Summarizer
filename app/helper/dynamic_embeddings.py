from langchain_google_genai import GoogleGenerativeAIEmbeddings
from typing import List, Optional
from app.helper.gauntlet_helper import get_gauntlet_credentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.data.database import get_db

class DynamicGoogleEmbeddings(GoogleGenerativeAIEmbeddings):
    """
    A wrapper around GoogleGenerativeAIEmbeddings that dynamically 
    fetches the API key for the current user context if possible.
    """
    
    async def _get_dynamic_key(self) -> str:
        # This is tricky because LangChain calls these methods synchronously 
        # or without an easy way to pass the current user.
        # For now, we will rely on the fact that we can initialize 
        # a temporary one in the router if needed, or we use a fallback.
        return self.google_api_key

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # Traditional synchronous call
        return super().embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        # Traditional synchronous call
        return super().embed_query(text)

def get_embeddings_for_user(api_key: Optional[str] = None, model: Optional[str] = None):
    """Returns an embedding instance using the provided key/model or system defaults."""
    from app.config import GEMINI_API_KEY
    key = (api_key or GEMINI_API_KEY).strip()
    # Default to the state-of-the-art native multimodal embedding model
    target_model = model or "models/gemini-embedding-2-preview"
    
    # LOG: Print configuration for debugging
    masked_key = f"{key[:6]}...{key[-4:]}" if key else "NONE"
    print(f"LOG: Initializing Embeddings | Model: {target_model} | Key: {masked_key}")
    
    return GoogleGenerativeAIEmbeddings(
        model=target_model,
        google_api_key=key
    )
