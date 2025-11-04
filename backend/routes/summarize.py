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
                "model": "deepseek-v3.1:671b-cloud",
                "prompt": prompt,
                "stream": False
            },
            timeout=180
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
    import logging
    logger = logging.getLogger(__name__)

    # Strip markdown code fences if present
    text = response_text.strip()
    logger.info(f"Raw response (first 200 chars): {repr(text[:200])}")

    if text.startswith('```'):
        # Remove opening fence (```json or ```)
        lines = text.split('\n')
        lines = lines[1:]  # Skip first line with ```
        # Remove closing fence
        if lines and lines[-1].strip() == '```':
            lines = lines[:-1]
        text = '\n'.join(lines)
        logger.info(f"After fence removal (first 200 chars): {repr(text[:200])}")

    # Try to find JSON in the response
    start_idx = text.find('{')
    end_idx = text.rfind('}') + 1

    if start_idx == -1 or end_idx == 0:
        logger.error("No JSON found in response")
        logger.error(f"Failed to parse text: {repr(response_text[:500])}")
        return {
            "summary": "Unable to parse AI response - no JSON found",
            "repetition_json": [],
            "agitation_score": 0.0,
            "mood_label": "unknown",
            "suggestions": "Unable to parse detailed analysis"
        }

    json_str = text[start_idx:end_idx]
    logger.info(f"Extracted JSON (first 200 chars): {repr(json_str[:200])}")

    try:
        parsed = json.loads(json_str)
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode failed: {str(e)}")
        logger.error(f"Failed to parse text: {repr(response_text[:500])}")
        return {
            "summary": "Unable to parse AI response - invalid JSON",
            "repetition_json": [],
            "agitation_score": 0.0,
            "mood_label": "unknown",
            "suggestions": "Unable to parse detailed analysis"
        }

    # Extract summary field, fill in missing fields with defaults
    if "summary" not in parsed:
        logger.warning("Missing 'summary' field in parsed response")

    result = {
        "summary": parsed.get("summary", "No summary provided"),
        "repetition_json": parsed.get("repetition_json", []),
        "agitation_score": parsed.get("agitation_score", 0.0),
        "mood_label": parsed.get("mood_label", "unknown"),
        "suggestions": parsed.get("suggestions", "")
    }

    return result


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
