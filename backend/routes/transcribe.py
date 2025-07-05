# /transcribe

from models import TranscribeRequest, TranscribeResponse
import crud
from fastapi import APIRouter, HTTPException, status
import subprocess
import os
import tempfile


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

        # Verify audio file exists
        if not os.path.exists(request.audio_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audio file not found"
            )

        # Create temporary file for transcript output
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.txt', delete=False) as tmp_file:
            tmp_txt_path = tmp_file.name

        try:
            # Call whisper.cpp for transcription
            # Note: Adjust paths based on your whisper.cpp installation
            whisper_cmd = [
                "./bin/whisper",  # Adjust path as needed
                "-m", "models/whisper-tiny-int8.bin",  # Adjust model path as needed
                "-f", request.audio_path,
                "-otxt",
                # whisper adds .txt extension
                "-of", tmp_txt_path.replace('.txt', '')
            ]

            result = subprocess.run(
                whisper_cmd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )

            if result.returncode != 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Whisper transcription failed: {result.stderr}"
                )

            # Read transcription result
            transcript_text = ""
            if os.path.exists(tmp_txt_path):
                with open(tmp_txt_path, 'r', encoding='utf-8') as f:
                    transcript_text = f.read().strip()

            if not transcript_text:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="No transcription text generated"
                )

            # Store audio chunk record
            chunk_id = crud.insert_audio_chunk(
                request.session_id, request.audio_path)

            # Store transcript in database
            crud.insert_transcript(
                session_id=request.session_id,
                text=transcript_text,
                chunk_id=chunk_id,
                language="en"  # Could be detected from whisper output
            )

            return TranscribeResponse(transcript=transcript_text)

        finally:
            # Clean up temporary file
            if os.path.exists(tmp_txt_path):
                os.unlink(tmp_txt_path)

    except HTTPException:
        raise
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Transcription timed out"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed: {str(e)}"
        )
