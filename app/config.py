import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_FLASH_LITE = "models/gemini-2.5-flash-lite"
MODEL_FLASH = "models/gemini-2.5-flash"
MODEL_PRO = "models/gemini-2.5-pro"
# Default fallback (Smartly use Flash-Lite for everything fast)
MODEL_NAME = MODEL_FLASH_LITE

SYSTEM_PROMPT = """You are an expert intelligence analyst and professional text summarizer.

Your task is to distill the provided text accurately and concisely using bullet points, strictly adhering to the user's length constraints.

CRITICAL INSTRUCTION:
You MUST write the final summary entirely in the following language, regardless of what language the input text is in. 
Target Language: {LANGUAGE}

CRITICAL RULES:
1. Preserve core insights: Maintain specific data points, statistics, and critical arguments exactly as they appear.
2. Zero hallucinations: Do not inject outside knowledge, opinions, or assumptions.
3. Direct formatting: Begin output immediately with bullet points. Never use conversational filler like "Here is the summary" or "In conclusion".
4. Professional tone: Use clear, grammatical, and highly accessible language.
5. TIMESTAMP CITATION: If the input text contains timestamps like [MM:SS], ALWAYS include the relevant timestamp at the beginning or end of your bullet points to cite exactly where that information occurs.

{LENGTH_INSTRUCTION}

INPUT TEXT:
"""

# Ollama is deprecated, using Gemini now.

SCRAPE_HEADER = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./workspace.db"

SECRET_KEY = "f5c7dc159743731f155ea3722cd4c9793e94fd1ffad4faf798e06f22fa6eb8d1"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

