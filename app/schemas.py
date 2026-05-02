from pydantic import BaseModel,Field
from typing import Literal

class BasicConfigs(BaseModel):
    length: Literal["short", "standard", "detailed"] = "standard"
    language : Literal["English","Hindi"] = "English"
    
class Prompt(BasicConfigs): 
    text : str = Field(min_length=1)

class Scrape(BasicConfigs):
    url : str = Field(min_length=1)

class Transcribe(Scrape):
    pass

class PdfExtract(BasicConfigs):
    pass

class Sign(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)

class QA(BaseModel):
    question: str = Field(min_length=1)
    document_id: int

class QuizQuestion(BaseModel):
    question: str = Field(min_length=1,description="Question based on document",)
    options: list[str] = Field(min_length=4,description="Multiple options where one is correct")
    correct_answer: str = Field(min_length=1,description="Correct answer with simple explanation")
    explanation: str = Field(min_length=1,description="A proper concise , factual and simple explanation")

class Quiz(BaseModel):
    questions : list[QuizQuestion] = Field(min_length=1,description="All the relative questions from document")

class QuizConfig(BaseModel):
    difficulty: Literal["easy", "medium", "hard"] = "medium"
