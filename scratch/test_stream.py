import asyncio
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def test_stream():
    print("Testing stream...")
    try:
        # Trying without await on the call itself first
        async for chunk in await client.aio.models.generate_content_stream(
            model="models/gemini-2.5-flash-lite",
            contents="Say hello"
        ):
            print(f"Chunk: {chunk.text}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test_stream())
