# /api/freeform/extract, /api/freeform/analyze, /api/freeform/summarize

import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from models import ExtractRequest, ExtractResponse, AnalyzeRequest, AnalyzeResponse, ChainSummarizeRequest, SummarizeResponse
import crud
from fastapi import APIRouter, HTTPException, status
import requests
import json
import os


router = APIRouter(prefix="/api/freeform", tags=["freeform_chain"])


def load_prompt_template(stage: str) -> str:
    """Load prompt template for the given stage."""
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    template_path = os.path.join(
        backend_dir, "prompts", f"freeform_{stage}.json")

    try:
        with open(template_path, 'r') as f:
            template_data = json.load(f)
            return template_data["prompt_template"]
    except (FileNotFoundError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prompt template not found for freeform_{stage}"
        )


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


def parse_json_response(response_text: str) -> dict:
    """Parse JSON response from Ollama."""
    try:
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1

        if start_idx == -1 or end_idx == 0:
            raise ValueError("No JSON found in response")

        json_str = response_text[start_idx:end_idx]
        return json.loads(json_str)

    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse JSON response: {str(e)}"
        )


@router.post("/extract", response_model=ExtractResponse)
async def extract_freeform_data(request: ExtractRequest):
    """Extract structured data from freeform conversation transcript."""
    try:
        # Load extract prompt template
        prompt_template = load_prompt_template("extract")

        # Format prompt with transcript
        formatted_prompt = prompt_template.format(
            transcript=request.transcript)

        # Call Ollama API
        response = call_ollama_api(formatted_prompt)

        # Parse response
        extracted_data = parse_json_response(response)

        return ExtractResponse(data=extracted_data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Extraction failed: {str(e)}"
        )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_freeform_data(request: AnalyzeRequest):
    """Analyze extracted freeform conversation data."""
    try:
        # Load analyze prompt template
        prompt_template = load_prompt_template("analyze")

        # Format prompt with extracted data
        formatted_prompt = prompt_template.format(
            extracted_data=json.dumps(request.extracted_data, indent=2))

        # Call Ollama API
        response = call_ollama_api(formatted_prompt)

        # Parse response
        analyzed_data = parse_json_response(response)

        return AnalyzeResponse(data=analyzed_data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_freeform_session(request: ChainSummarizeRequest):
    """Generate final summary using extracted and analyzed data."""
    try:
        # Verify session exists
        session = crud.get_session(request.session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Load summarize prompt template
        prompt_template = load_prompt_template("summary")

        # Format prompt with both extracted and analyzed data
        formatted_prompt = prompt_template.format(
            extracted_data=json.dumps(request.extracted_data, indent=2),
            analyzed_data=json.dumps(request.analyzed_data, indent=2)
        )

        # Call Ollama API
        response = call_ollama_api(formatted_prompt)

        # Parse response
        summary_data = parse_json_response(response)

        # Store summary in database
        crud.insert_summary(
            session_id=request.session_id,
            summary_text=summary_data.get("summary", ""),
            repetition_json=summary_data.get("repeated_questions", []),
            agitation_score=summary_data.get("agitation_score", 0.0),
            mood_label=summary_data.get("tone", "unknown"),
            suggestions=summary_data.get("suggestions")
        )

        return SummarizeResponse(
            summary=summary_data.get("summary", ""),
            tone=summary_data.get("tone", ""),
            repeated_questions=summary_data.get("repeated_questions", []),
            key_moments=summary_data.get("key_moments", []),
            tags=summary_data.get("tags", []),
            agitation_score=summary_data.get("agitation_score", 0.0),
            mood_label=summary_data.get("mood_label", "")
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed: {str(e)}"
        )
