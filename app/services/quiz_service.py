import json
from app.services.llm_service import llm_response, llm_full_response
from app.config import MODEL_NAME

async def generate_quiz_stream(context: str, difficulty: str):
    prompt = f"""
You are an expert examiner. Generate a multiple-choice quiz based ONLY on the content below.

## RULES:
1. QUANTITY: Max 10 questions.
2. DIFFICULTY: {difficulty}
3. FORMAT: RAW JSON ONLY. Start with '{{' and end with '}}'.
   
SCHEMA:
{{
  "questions": [
    {{
      "question": "The question text",
      "options": ["Opt 1", "Opt 2", "Opt 3", "Opt 4"],
      "correct_answer": "The exact correct option string",
      "explanation": "Brief explanation"
    }}
  ]
}}

CONTENT:
{context}
"""
    async for chunk in llm_response(prompt, MODEL_NAME):
        yield chunk

async def generate_quiz(context:str, difficulty, retry=True):
    prompt = f"Generate a {difficulty} quiz in JSON format based on: {context}"
    response = await llm_full_response(prompt, MODEL_NAME)
    return response


