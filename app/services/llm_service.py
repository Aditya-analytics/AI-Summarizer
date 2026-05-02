import httpx

async def llm_response(prompt, model, url):
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True
    }
    
    # 1. Open the client
    async with httpx.AsyncClient(timeout=300.0) as client:
        # 2. Make the streaming request (Ollama uses POST, not GET)
        async with client.stream("POST", url, json=payload) as response:
            response.raise_for_status()
            
            # 3. Loop over the lines and YIELD them
            async for line in response.aiter_lines():
                if line:
                    yield line

async def llm_full_response(prompt, model, url):

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    # 1. Open the client
    async with httpx.AsyncClient(timeout=300.0) as client:
        response = await client.post(url,json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("response","")
        

            

