import json
import os
import sys
from dotenv import load_dotenv
from github_utils import get_repositories, select_top_repositories, download_and_combine_code
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def generate_prompt(code_blob: str):
    return f"""
Analyze this GitHub user's repositories as an expert code reviewer. Provide a comprehensive assessment in JSON format with the following structure:

{{
  "overallEvaluation": {{
    "codeQualityRating": [1-10 score],
    "securityRating": [1-10 score],
    "documentationRating": [1-10 score],
    "overallRating": [1-10 score],
    "summary": "Concise analysis of developer's overall skill and patterns across repositories",
    "strengths": ["List of 2-3 key strengths"],
    "improvementAreas": ["List of 2-3 specific improvement suggestions"]
  }},
  "repositoriesAnalysis": [
    {{
      "repoName": "repository-name",
      "primaryLanguage": "Main programming language used",
      "codeQualityRating": [1-10 score],
      "securityRating": [1-10 score],
      "documentationRating": [1-10 score],
      "overallRating": [1-10 score],
      "analysis": "Brief explanation of strengths and weaknesses in this specific repository",
      "bestPractices": ["Notable good practices observed"]
    }}
  ]
}}

Evaluate based on these criteria:
- Code Quality: Structure, readability, best practices, patterns, efficiency, test coverage, error handling
- Security: Authentication handling, input validation, vulnerability prevention, dependency management, secrets handling
- Documentation: Comments, README quality, inline documentation, usage examples, API documentation
- Overall Developer Skill: Technical proficiency, problem-solving approaches, code complexity management, technology choices

For each repository, examine:
- Code organization and architecture
- Consistency in coding style
- Use of modern language features
- Error and exception handling
- Security vulnerabilities
- Documentation completeness

Provide numerical scores (1-10) and brief explanations for each category.

Code:
{code_blob[:950000]}  # keep under 1M token limit
"""

def analyze_user(username: str):
    print(f"Analyzing GitHub user: {username}")
    repos = get_repositories(username)
    top_repos = select_top_repositories(repos)
    combined_code = download_and_combine_code(username, top_repos)

    prompt = generate_prompt(combined_code)

    print("Sending code to Gemini...")
    response = model.generate_content(prompt, generation_config={"temperature": 0.3})

    try:
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()

        print("Cleaned Gemini response:", response_text)
        analysis_json = json.loads(response_text)
        return analysis_json
    except Exception as e:
        print("Error parsing Gemini response:", e)
        return {"error": "Failed to parse Gemini response"}




if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_github.py <github_username>")
    else:
        analyze_user(sys.argv[1])