from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker,AsyncSession
from app.config import SQLALCHEMY_DATABASE_URL

engine = create_async_engine(
    url=SQLALCHEMY_DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_recycle=3600
)

async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,  # Ensures it returns AsyncSession objects
    expire_on_commit=False # Recommended for async to avoid accidental lazy-loading errors
)

async def get_db():
    async with async_session() as session:
        yield session 

