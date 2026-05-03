from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.data.database import get_db
from app.helper.auth import get_current_user
from app.data.models import User
from app.helper.security import encrypt_api_key, decrypt_api_key
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/gauntlet", tags=["gauntlet"])

class GauntletSettings(BaseModel):
    api_key: Optional[str] = None
    engine_model: str = Field(default="models/gemini-2.5-flash-lite")
    embeddings_model: str = Field(default="models/gemini-embedding-2-preview")

@router.get("/settings", status_code=200)
async def get_gauntlet_settings(
    current_user: User = Depends(get_current_user)
):
    """Returns user's gauntlet settings (masking the API key)."""
    # Map legacy IDs for UI consistency
    model_map = {
        "models/gemini-2.0-flash-lite": "models/gemini-2.5-flash-lite",
        "models/gemini-2.0-flash": "models/gemini-2.5-flash-lite",
        "models/gemini-1.5-pro": "models/gemini-2.5-pro"
    }
    engine_model = model_map.get(current_user.gauntlet_engine_model, current_user.gauntlet_engine_model)
    
    return {
        "has_custom_key": bool(current_user.gauntlet_api_key),
        "engine_model": engine_model,
        "embeddings_model": current_user.gauntlet_embeddings_model,
        "free_calls_remaining": current_user.free_calls_remaining
    }

@router.post("/settings", status_code=200)
async def update_gauntlet_settings(
    settings: GauntletSettings,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates user's gauntlet settings, encrypting the API key."""
    if settings.api_key:
        current_user.gauntlet_api_key = encrypt_api_key(settings.api_key)
    
    # Map legacy IDs to latest versions if needed
    model_map = {
        "models/gemini-2.0-flash-lite": "models/gemini-2.5-flash-lite",
        "models/gemini-2.0-flash": "models/gemini-2.5-flash-lite",
        "models/gemini-1.5-pro": "models/gemini-2.5-pro"
    }
    
    current_user.gauntlet_engine_model = model_map.get(settings.engine_model, settings.engine_model)
    current_user.gauntlet_embeddings_model = settings.embeddings_model
    
    await db.commit()
    return {"message": "Gauntlet settings updated successfully."}

@router.delete("/key", status_code=200)
async def remove_api_key(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Removes the custom API key, falling back to Nova free calls."""
    current_user.gauntlet_api_key = None
    await db.commit()
    return {"message": "Infinity Stone removed. Falling back to Nova system calls."}
