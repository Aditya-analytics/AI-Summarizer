from google import genai
from app.config import GEMINI_API_KEY, MODEL_NAME

def get_llm_client(api_key=None):
    """Returns a Gemini client using the provided key or system default."""
    # Ensure the key is stripped of any newlines or spaces that cause "Illegal header value"
    key = (api_key or GEMINI_API_KEY).strip()
    return genai.Client(api_key=key)

async def llm_response(prompt, model=None, api_key=None):
    """Streaming response from Gemini with dynamic model and key support."""
    client = get_llm_client(api_key)
    target_model = model or MODEL_NAME
    
    try:
        # Use models.generate_content_stream for streaming
        async for chunk in await client.aio.models.generate_content_stream(
            model=target_model,
            contents=prompt
        ):
            if chunk.text:
                yield chunk.text
    except Exception as e:
        error_str = str(e)
        if "403" in error_str or "denied access" in error_str.lower():
            msg = "The AI project is denied access (403). Please verify your API key in the Nova Gauntlet or check your Google AI Studio project status."
            print(f"LOG: Critical AI Access Error: {msg}")
            yield f"Error: {msg}"
        else:
            print(f"LOG: Gemini Stream Error: {e}")
            yield f"Error: {error_str}"

async def llm_full_response(prompt, model=None, api_key=None):
    """Non-streaming full response from Gemini with dynamic model and key support."""
    client = get_llm_client(api_key)
    target_model = model or MODEL_NAME
    
    try:
        response = await client.aio.models.generate_content(
            model=target_model,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"LOG: Gemini Full Response Error: {e}")
        

            

