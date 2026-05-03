import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_FLASH_LITE = "models/gemini-2.5-flash-lite"
MODEL_FLASH = "models/gemini-2.5-flash"
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

SCRAPE_HEADER = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./workspace.db"

SECRET_KEY = "f5c7dc159743731f155ea3722cd4c9793e94fd1ffad4faf798e06f22fa6eb8d1"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

