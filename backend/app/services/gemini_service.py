import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    # This is a placeholder. In a real scenario, we'd log a warning or error.
    # For now, we assume the environment will be set up correctly.
    pass

genai.configure(api_key=GOOGLE_API_KEY)

def get_model(model_name: str = "gemini-2.0-flash-lite"):
    return genai.GenerativeModel(model_name)
