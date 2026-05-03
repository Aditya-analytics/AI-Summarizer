import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    url = os.getenv("DATABASE_URL")
    print(f"Testing connection to: {url.split('@')[1] if '@' in url else url}")
    try:
        engine = create_async_engine(url)
        async with engine.connect() as conn:
            result = await conn.execute("SELECT 1")
            print("✅ Connection Successful!")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_connection())
