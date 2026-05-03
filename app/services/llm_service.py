from google import genai
from app.config import GEMINI_API_KEY, MODEL_NAME

client = genai.Client(api_key=GEMINI_API_KEY)

async def llm_response(prompt, model=MODEL_NAME):
    """Streaming response from Gemini using new SDK"""
    try:
        # Use models.generate_content_stream for streaming
        async for chunk in await client.aio.models.generate_content_stream(
            model=model,
            contents=prompt
        ):
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"LOG: Gemini Stream Error: {e}")
        yield f"Error: {str(e)}"

async def llm_full_response(prompt, model=MODEL_NAME):
    """Non-streaming full response from Gemini using new SDK"""
    try:
        response = await client.aio.models.generate_content(
            model=model,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"LOG: Gemini Full Response Error: {e}")
        return f"Error: {str(e)}"
        

            

