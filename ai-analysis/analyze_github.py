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

Return ONLY valid JSON without any text before or after. Do not include markdown code block formatting.

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
    try:
        repos = get_repositories(username)
        top_repos = select_top_repositories(repos)
        combined_code = download_and_combine_code(username, top_repos)

        prompt = generate_prompt(combined_code)

        # Request JSON response format
        response = model.generate_content(
            prompt, 
            generation_config={
                "temperature": 0.3,
                "response_mime_type": "application/json"
            }
        )

        # Try multiple approaches to extract JSON
        try:
            # Try to parse the response directly
            if hasattr(response, 'text'):
                response_text = response.text.strip()
                
                # Remove any markdown formatting
                if response_text.startswith("```json"):
                    response_text = response_text.replace("```json", "").replace("```", "").strip()
                elif response_text.startswith("```"):
                    response_text = response_text.replace("```", "").strip()
                
                # Handle potential JSON formatting issues
                if response_text.startswith("{") and response_text.endswith("}"):
                    analysis_json = json.loads(response_text)
                    return analysis_json
            
            # Try to extract from parts if available
            if hasattr(response, 'parts') and response.parts:
                for part in response.parts:
                    if hasattr(part, 'text') and part.text:
                        clean_text = part.text.strip()
                        if "```json" in clean_text:
                            start = clean_text.find("```json") + 7
                            end = clean_text.rfind("```")
                            if end > start:
                                clean_text = clean_text[start:end].strip()
                        elif "```" in clean_text:
                            start = clean_text.find("```") + 3
                            end = clean_text.rfind("```")
                            if end > start:
                                clean_text = clean_text[start:end].strip()
                        
                        try:
                            return json.loads(clean_text)
                        except:
                            continue
            
            # Last resort, try to find anything that looks like JSON
            full_text = response.text
            if "{" in full_text and "}" in full_text:
                json_start = full_text.find("{")
                json_end = full_text.rfind("}") + 1
                json_text = full_text[json_start:json_end]
                return json.loads(json_text)
                
            raise Exception("Could not extract valid JSON from response")
            
        except Exception as e:
            return {"error": f"Failed to parse Gemini response: {str(e)}"}
    except Exception as e:
        return {"error": f"Error in analysis process: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_github.py <github_username>")
    else:
        analyze_user(sys.argv[1])