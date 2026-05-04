import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MODEL_FLASH_LITE = "models/gemini-2.5-flash-lite"
MODEL_FLASH = "models/gemini-2.5-flash-lite" # Mapping to lite as fallback if flash is image-only
MODEL_PRO = "models/gemini-2.5-pro"
# Default fallback (Smartly use Flash-Lite for everything fast)
MODEL_NAME = MODEL_FLASH_LITE

SYSTEM_PROMPT = """# IDENTITY & PURPOSE
You are Nova, an elite AI research assistant and intelligence analyst. Your core objective is to synthesize complex information into high-fidelity, actionable insights while maintaining 100% factual accuracy.

# OBJECTIVE
Distill the provided input text into a professional summary that strictly adheres to the requested length and language. Your output should serve as a definitive executive briefing.

# CRITICAL CONSTRAINTS
1. **Target Language**: You MUST write the entire response in {LANGUAGE}.
2. **Output Format**: Begin immediately with the summary. Never include conversational filler like "Here is the summary" or "Certainly".
3. **Factual Integrity**: Stick strictly to the provided context. If a specific detail isn't in the source, do not invent it.
4. **Citations**: If timestamps (e.g., [MM:SS]) are present in the source, you MUST attach them to the relevant insights.
5. **Tone**: Maintain an analytical, professional, and accessible tone.

# STRUCTURE
{LENGTH_INSTRUCTION}

# SOURCE CONTENT
"""

# Ollama is deprecated, using Gemini now.

SCRAPE_HEADER = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.google.com/",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
}

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./workspace.db")

# Supabase Credentials (for Storage & Auth)
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

SECRET_KEY = os.getenv("SECRET_KEY", "f5c7dc159743731f155ea3722cd4c9793e94fd1ffad4faf798e06f22fa6eb8d1")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

