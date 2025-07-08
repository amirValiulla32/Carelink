# /transcribe

from models import TranscribeRequest, TranscribeResponse
import crud
from fastapi import APIRouter, HTTPException, status
from whisper_utils import transcribe_audio_file


router = APIRouter(prefix="/api", tags=["transcription"])


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(request: TranscribeRequest):
    """Transcribe audio file using whisper.cpp and store in database."""
    try:
        # Verify session exists
        session = crud.get_session(request.session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Transcribe audio using whisper.cpp
        transcript_text = transcribe_audio_file(request.audio_path)

        # Store audio chunk record
        chunk_id = crud.insert_audio_chunk(
            request.session_id, request.audio_path)

        # Store transcript in database
        crud.insert_transcript(
            session_id=request.session_id,
            text=transcript_text,
            chunk_id=chunk_id,
            language="en"
        )

        return TranscribeResponse(transcript=transcript_text)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed: {str(e)}"
        )
