import httpx
from bs4 import BeautifulSoup
from app.config import SCRAPE_HEADER

async def scrape_url(url:str):
    import asyncio
    import random
    
    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            async with httpx.AsyncClient(follow_redirects=True, http2=True) as client:
                response = await client.get(url=url, headers=SCRAPE_HEADER, timeout=30.0)
                
                if response.status_code == 403:
                    # If forbidden, wait a bit and retry once with a slightly jittered delay
                    if attempt < max_retries:
                        await asyncio.sleep(random.uniform(1.0, 3.0))
                        continue
                
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")
            
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.extract()

                text = soup.get_text(separator="\n", strip=True)
                return text
        except Exception as e:
            if attempt == max_retries:
                print(f"SCRAPE ERROR after {attempt} retries: {str(e)}")
                raise e
            await asyncio.sleep(1.0)
        

