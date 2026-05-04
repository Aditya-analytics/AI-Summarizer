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
            
            # Force decode and log if block persists
            if response.status_code == 403:
                print(f"LOGG : Wikipedia 403 persist even with requests. URL: {url}")
            
            response.raise_for_status()

            # Sanitization: Ensure content is decoded as utf-8, ignoring binary artifacts
            content = response.content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, "html.parser")
            
            # Remove noise
            for script in soup(["script", "style", "nav", "footer"]):
                script.extract()

            text = soup.get_text(separator="\n", strip=True)
            
            # CRITICAL: Strip NULL bytes which PostgreSQL rejects
            sanitized_text = text.replace('\x00', '')
            
            return sanitized_text
            
    except Exception as e:
        print(f"SCRAPE ERROR: {str(e)}")
        raise e
        

