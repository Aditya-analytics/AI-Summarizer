import httpx
from bs4 import BeautifulSoup
from app.config import SCRAPE_HEADER

async def scrape_url(url:str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url=url,headers=SCRAPE_HEADER,timeout=20.0)
        response.raise_for_status()

        soup = BeautifulSoup(response.text,"html.parser")
    
        text = soup.get_text(separator="\n", strip=True)

        return text
        

