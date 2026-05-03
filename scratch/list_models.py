import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

try:
    print("Listing models with list_models()...")
    models = list(genai.list_models())
    if not models:
        print("No models found. Check API key.")
    for m in models:
        print(f"Name: {m.name}, Methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {e}")
