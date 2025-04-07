import json
import os
import sys
import re
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

CRITICAL: Return ONLY valid JSON without any text before or after. Do not include markdown code block formatting, comments, or placeholders. JSON does not support comments like '// ...' or '/* ... */', so do not include any comments in your response.

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

def remove_comments(json_string):
    """Remove both single-line and multi-line comments from JSON string."""
    # Remove single-line comments (// ...)
    json_string = re.sub(r'//.*?(\n|$)', '', json_string)
    # Remove multi-line comments (/* ... */)
    json_string = re.sub(r'/\*[\s\S]*?\*/', '', json_string)
    return json_string

def extract_valid_json(text):
    """Extract valid JSON from a text that might contain other content."""
    # Remove markdown code blocks
    if "```" in text:
        text = re.sub(r'```(?:json)?\s*([\s\S]*?)\s*```', r'\1', text)
    
    # Remove comments that might be causing JSON parsing errors
    text = remove_comments(text)
    
    # Try to find JSON object
    try:
        # First try direct parsing
        return json.loads(text)
    except json.JSONDecodeError:
        # If that fails, try to extract JSON from within the text
        try:
            # Find the outermost JSON object
            start = text.find('{')
            end = text.rfind('}') + 1
            if start >= 0 and end > start:
                extracted = text[start:end]
                # Try parsing with comment removal
                cleaned = remove_comments(extracted)
                return json.loads(cleaned)
        except json.JSONDecodeError:
            # If still failing, try more aggressive approaches
            try:
                # Try manual JSON formatting fix for common issues
                text = text.replace(",]", "]").replace(",}", "}")
                # Try again with fixed JSON
                return json.loads(text)
            except json.JSONDecodeError:
                raise Exception("Could not extract valid JSON after multiple attempts")

def analyze_user(username: str):
    print(f"Analyzing GitHub user: {username}")
    try:
        repos = get_repositories(username)
        top_repos = select_top_repositories(repos)
        combined_code = download_and_combine_code(username, top_repos)

        prompt = generate_prompt(combined_code)

        print("Sending code to Gemini...")
        # Request JSON response format with a stricter temperature
        response = model.generate_content(
            prompt, 
            generation_config={
                "temperature": 0.1,  # Lower temperature for more consistent output
                "response_mime_type": "application/json",
                "max_output_tokens": 8000  # Limit to avoid potential truncation
            }
        )

        try:
            print("Processing response...")
            response_text = ""
            
            # Extract text from response
            if hasattr(response, 'text'):
                response_text = response.text.strip()
                print(f"Response length: {len(response_text)} bytes")
                print(f"Response sample: {response_text[:100]}...")
            else:
                # Try parts if text isn't available
                if hasattr(response, 'parts') and response.parts:
                    for part in response.parts:
                        if hasattr(part, 'text') and part.text:
                            response_text += part.text
            
            if not response_text:
                print("Warning: Empty response received")
                return {"error": "Empty response from Gemini API"}
            
            # Process the response text to extract valid JSON
            print("Extracting JSON from response...")
            analysis_json = extract_valid_json(response_text)

            print("Success! JSON extracted successfully.")
            return analysis_json
            
        except Exception as e:
            print(f"Error parsing response: {str(e)}")
            print(f"Dumping raw response for debugging: {response_text[:500]}")
            return {"error": f"Failed to parse Gemini response: {str(e)}", "data": {}}
    except Exception as e:
        print(f"Error in analysis process: {str(e)}")
        return {"error": f"Error analyzing GitHub user: {str(e)}", "data": {}}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_github.py <github_username>")
    else:
        result = analyze_user(sys.argv[1])
        if "error" not in result:
            print("Analysis completed successfully!")
        print(json.dumps(result, indent=2))