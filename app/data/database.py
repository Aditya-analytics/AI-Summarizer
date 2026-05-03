from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker,AsyncSession
from app.config import SQLALCHEMY_DATABASE_URL

# PostgreSQL (Supabase) requires pool settings, SQLite does not support them
engine_args = {}
if "sqlite" not in SQLALCHEMY_DATABASE_URL:
    engine_args = {
        "pool_size": 20,
        "max_overflow": 10,
        "pool_recycle": 3600
    }

engine = create_async_engine(
    url=SQLALCHEMY_DATABASE_URL,
    **engine_args
)

async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,  # Ensures it returns AsyncSession objects
    expire_on_commit=False # Recommended for async to avoid accidental lazy-loading errors
)

async def get_db():
    async with async_session() as session:
        yield session 

