import httpx
from bs4 import BeautifulSoup
from app.config import SCRAPE_HEADER

async def scrape_url(url:str):
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(url=url,headers=SCRAPE_HEADER,timeout=30.0)
        response.raise_for_status()

        soup = BeautifulSoup(response.text,"html.parser")
    
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.extract()

        text = soup.get_text(separator="\n", strip=True)

        return text
        

