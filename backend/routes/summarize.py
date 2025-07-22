# /summarize

from models import SummarizeRequest, SummarizeResponse
import crud
from fastapi import APIRouter, HTTPException, status
import requests
import json
import os


router = APIRouter(prefix="/api", tags=["summarization"])


def load_prompt_template(session_type: str) -> str:
    """Load prompt template for the given session type."""
    # Get the backend directory path
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    template_path = os.path.join(
        backend_dir, "prompts", f"{session_type.lower()}.json")

    # Fall back to default if specific template doesn't exist
    if not os.path.exists(template_path):
        template_path = os.path.join(backend_dir, "prompts", "default.json")

    try:
        with open(template_path, 'r') as f:
            template_data = json.load(f)
            return template_data["prompt_template"]
    except (FileNotFoundError, KeyError):
        # Ultimate fallback prompt
        return """You are analyzing a care session with a dementia patient. Provide a structured summary.

Transcript: {transcript}

Respond in JSON format:
{
  "summary": "Brief summary",
  "repetition_json": [{"phrase": "example", "count": 2}],
  "agitation_score": 2.5,
  "mood_label": "calm",
  "suggestions": "Care recommendations"
}"""


def call_ollama_api(prompt: str) -> dict:
    """Call Ollama API for text generation."""
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma3n:latest",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Ollama API error: {response.status_code}"
            )

        result = response.json()
        return result.get("response", "")

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cannot connect to Ollama API. Make sure Ollama is running."
        )
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Ollama API request timed out"
        )


def parse_gemma_response(response_text: str) -> dict:
    """Parse Gemma's JSON response and extract structured data."""
    try:
        # Try to find JSON in the response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1

        if start_idx == -1 or end_idx == 0:
            raise ValueError("No JSON found in response")

        json_str = response_text[start_idx:end_idx]
        parsed = json.loads(json_str)

        # Validate required fields
        required_fields = ["summary", "repetition_json",
                           "agitation_score", "mood_label"]
        for field in required_fields:
            if field not in parsed:
                raise ValueError(f"Missing required field: {field}")

        return parsed

    except (json.JSONDecodeError, ValueError) as e:
        # Fallback parsing if JSON is malformed
        return {
            "summary": response_text[:200] + "..." if len(response_text) > 200 else response_text,
            "repetition_json": [],
            "agitation_score": 0.0,
            "mood_label": "unknown",
            "suggestions": "Unable to parse detailed analysis"
        }


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_session(request: SummarizeRequest):
    """Generate summary using Gemma via Ollama and store in database."""
    try:
        # Verify session exists
        session = crud.get_session(request.session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Load appropriate prompt template
        prompt_template = load_prompt_template(request.session_type)

        # Format prompt with transcript
        formatted_prompt = prompt_template.format(
            transcript=request.transcript)

        # Call Ollama API
        gemma_response = call_ollama_api(formatted_prompt)

        # Parse response
        parsed_response = parse_gemma_response(gemma_response)

        # Store summary in database
        crud.insert_summary(
            session_id=request.session_id,
            summary_text=parsed_response["summary"],
            repetition_json=parsed_response["repetition_json"],
            agitation_score=parsed_response["agitation_score"],
            mood_label=parsed_response["mood_label"],
            suggestions=parsed_response.get("suggestions")
        )

        return SummarizeResponse(
            summary=parsed_response["summary"],
            repetition_json=parsed_response["repetition_json"],
            agitation_score=parsed_response["agitation_score"],
            mood_label=parsed_response["mood_label"]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed: {str(e)}"
        )
