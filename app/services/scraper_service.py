import requests
from bs4 import BeautifulSoup
from app.config import SCRAPE_HEADER
import time
import random

async def scrape_url(url:str):
    """
    Scrapes URL using requests for a more 'organic' TLS fingerprint to bypass 403 blocks.
    Includes a small randomized jitter and robust header management.
    """
    try:
        # Initial jitter to mimic human timing
        time.sleep(random.uniform(0.5, 1.5))
        
        with requests.Session() as session:
            session.headers.update(SCRAPE_HEADER)
            response = session.get(url, timeout=30.0, allow_redirects=True)
            
            # Log the block for debugging on Render if it persists
            if response.status_code == 403:
                print(f"LOGG : Wikipedia 403 persist even with requests. URL: {url}")
            
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            
            # Remove noise
            for script in soup(["script", "style", "nav", "footer"]):
                script.extract()

            text = soup.get_text(separator="\n", strip=True)
            return text
            
    except Exception as e:
        print(f"SCRAPE ERROR: {str(e)}")
        raise e
        

