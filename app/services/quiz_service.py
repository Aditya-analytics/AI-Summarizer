import json
from app.services.llm_service import llm_response, llm_full_response
from app.config import MODEL_NAME

async def generate_quiz_stream(context: str, difficulty: str):
    prompt = f"""# IDENTITY
You are an expert academic examiner. Your task is to generate a high-quality, challenging multiple-choice quiz based ONLY on the provided source content.

# OBJECTIVE
Create a {difficulty} difficulty quiz that tests deep understanding, not just surface-level facts.

# RULES & CONSTRAINTS
1. **Source Grounding**: All questions and answers must be derived strictly from the content below.
2. **Quantity**: Provide exactly 10 questions (or as many as the context allows, up to 10).
3. **Format**: You MUST output RAW JSON ONLY. No conversational text, no markdown code blocks, just the JSON object.
4. **Distractors**: Ensure that incorrect options (distractors) are plausible but clearly wrong.

# JSON SCHEMA
{{
  "questions": [
    {{
      "question": "Clear, concise question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "The exact string match from options",
      "explanation": "A one-sentence explanation of why this answer is correct based on the text."
    }}
  ]
}}

# SOURCE CONTENT
{context}
"""
    async for chunk in llm_response(prompt, MODEL_NAME):
        yield chunk
