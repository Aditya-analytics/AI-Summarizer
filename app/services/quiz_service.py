from pydantic import ValidationError
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from app.schemas import Quiz
from app.services.llm_service import llm_full_response
from app.config import OLLAMA_URL,MODEL_NAME
from fastapi import HTTPException
parser = PydanticOutputParser(pydantic_object=Quiz)

async def generate_quiz(context:str,difficulty):
    format_instructions = parser.get_format_instructions()
    prompt = """
You are an expert quiz creator. Your task is to generate multiple-choice questions that test understanding of the content provided below.

## Instructions

### Question Design
- Focus on key concepts, definitions, and important relationships — not trivial or peripheral details.
- Vary difficulty across recall, application, and reasoning question types.
- Each question must be self-contained and unambiguous.

### Answer Options
- Each question must have exactly 4 options labeled A, B, C, and D.
- Exactly one option must be unambiguously correct.
- The remaining three must be plausible distractors — clearly incorrect upon careful reading, but not obviously wrong at a glance.
- Never write questions where 0 or 2+ options could be considered correct.

### Grounding
- Base every question and every option strictly on the provided content.
- Do not introduce facts, definitions, or claims not present in the content.

---

Difficulty: {difficulty}

Content:
{context}

Output Format:
{format_instructions}
"""
    final_prompt = prompt.format(context=context,format_instructions=format_instructions,difficulty=difficulty)
    try :
        response = await llm_full_response(final_prompt,model=MODEL_NAME,url=OLLAMA_URL)
        return parser.parse(response)
    except (ValidationError, OutputParserException) as e:
        raise HTTPException(status_code=422, detail=f"AI returned malformed quiz JSON: {str(e)}")


