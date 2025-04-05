from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyze_github import analyze_user

app = FastAPI()

# CORS config so your frontend can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for POST request body
class AnalyzeRequest(BaseModel):
    username: str

@app.post("/analyze")
def analyze_repo(request: AnalyzeRequest):
    result = analyze_user(request.username)
    return {"data": result}
