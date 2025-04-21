from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyze_github import analyze_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    username: str

@app.post("/analyze")
def analyze_repo(request: AnalyzeRequest):
    result = analyze_user(request.username)
    return {"data": result}
