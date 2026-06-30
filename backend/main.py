import os
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# Load API key from environment variable
API_KEY = os.environ.get("LLM_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"  # Groq (free, OpenAI-compatible)
MODEL = "qwen/qwen3.6-27b"


app = FastAPI(title="Simple Chatbot API")

# CORS configuration - allow both local dev and production
ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Vite dev server
    "http://localhost:3000",      # Alternative local port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://internship-day-27.vercel.app",  # Your Vercel frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Request and response format
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
def home():
    return {"message": "Chatbot API is running"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not set")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
    "model": MODEL,
    "messages": [
        {
            "role": "system",
            "content": (
                "You are a helpful AI assistant. "
                "Always format your responses using clean Markdown. "
                "Use headings, bullet points, numbered lists, tables when appropriate, "
                "and fenced code blocks with language names for code. "
                "Do not use decorative lines like ======== or ----------."
            ),
        },
        {
            "role": "user",
            "content": request.message,
        },
    ],
}

    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, headers=headers, json=payload, timeout=30)

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Error from LLM API: " + response.text)

    data = response.json()
    reply = data["choices"][0]["message"]["content"]

    return ChatResponse(reply=reply)



"""


frontend (react) --> backend (FastAPI) --> grok (llama-3.3-70b-versatile)



"""