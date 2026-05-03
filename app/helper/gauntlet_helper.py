from app.data.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.helper.security import decrypt_api_key
from fastapi import HTTPException

async def get_gauntlet_credentials(user: User, db: AsyncSession):
    """
    Determines which API key and model to use based on Nova Gauntlet settings.
    Decrements free calls if system key is used.
    """
    # 1. Check if user has their own "Infinity Stone"
    if user.gauntlet_api_key:
        return {
            "api_key": decrypt_api_key(user.gauntlet_api_key),
            "engine_model": user.gauntlet_engine_model,
            "embeddings_model": user.gauntlet_embeddings_model,
            "is_free": False
        }
    
    # 2. Check if free calls are remaining
    if user.free_calls_remaining > 0:
        return {
            "api_key": None, # Will fallback to system key in services
            "engine_model": user.gauntlet_engine_model,
            "embeddings_model": user.gauntlet_embeddings_model,
            "is_free": True
        }
    
    # 3. No key and no free calls left
    raise HTTPException(
        status_code=403, 
        detail="Nova free tier exhausted. Please configure your own Infinity Stone in the Nova Gauntlet."
    )

async def consume_free_call(user: User, db: AsyncSession):
    """Decrements the free call counter for a user safely."""
    try:
        if user.free_calls_remaining > 0:
            user.free_calls_remaining -= 1
            await db.commit()
    except Exception as e:
        await db.rollback()
        print(f"LOG: Failed to consume free call for user {user.id}: {str(e)}")
