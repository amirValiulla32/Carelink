from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import os
import tempfile
import shutil
from datetime import datetime
import uuid
import json
import logging
import traceback
from typing import Optional

# Import our existing functions
import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from transcribe import transcribe_audio
import database

router = APIRouter(prefix="/api", tags=["audio"])

RECORDINGS_DIR = "recordings"
os.makedirs(RECORDINGS_DIR, exist_ok=True)

# Set up logger for this module
logger = logging.getLogger(__name__)

@router.post("/record-audio")
async def record_audio(
    audio: UploadFile = File(...),
    patient_id: str = Form("default_patient"),
    session_type: str = Form("freeform")
):
    """
    Upload audio file, transcribe it, and return transcript with metadata.
    This replaces the local recording functionality for web-based uploads.
    """
    try:
        # Validate audio file (more permissive check)
        print(f"Received file: {audio.filename}, Content-Type: {audio.content_type}, Size: {audio.size}")

        # Allow common audio types and some flexibility for webm/wav files
        valid_types = ['audio/', 'video/webm', 'application/octet-stream']
        if not any(audio.content_type.startswith(t) for t in valid_types):
            raise HTTPException(status_code=400, detail=f"File must be an audio file, received: {audio.content_type}")

        # Generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        session_id = f"session_{timestamp}_{uuid.uuid4().hex[:8]}"
        filename = f"{session_id}.wav"
        file_path = os.path.join(RECORDINGS_DIR, filename)

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)

        # Convert WebM to WAV if needed (whisper.cpp only supports flac, mp3, ogg, wav)
        wav_file_path = file_path
        if audio.content_type.startswith('video/webm') or audio.content_type.startswith('audio/webm'):
            logger.info(f"Converting WebM to WAV format for file: {file_path}")
            wav_file_path = file_path.replace('.wav', '_converted.wav')
            try:
                import subprocess
                result = subprocess.run([
                    'ffmpeg', '-i', file_path, '-acodec', 'pcm_s16le',
                    '-ar', '16000', '-ac', '1', wav_file_path, '-y'
                ], capture_output=True, text=True, timeout=30)

                if result.returncode != 0:
                    logger.error(f"FFmpeg conversion failed: {result.stderr}")
                    raise Exception(f"Audio conversion failed: {result.stderr}")

                logger.info(f"Successfully converted {file_path} to {wav_file_path}")
                # Remove the original WebM file to save space
                os.remove(file_path)
            except Exception as conversion_error:
                logger.error(f"Audio conversion failed: {str(conversion_error)}")
                raise HTTPException(status_code=500, detail=f"Audio conversion failed: {str(conversion_error)}")

        # Transcribe the audio
        logger.info(f"Starting transcription for file: {wav_file_path}")
        try:
            transcript = transcribe_audio(wav_file_path)
            logger.info(f"Transcription completed. Length: {len(transcript) if transcript else 0}, Content: {transcript[:100] if transcript else 'EMPTY'}")
        except Exception as transcription_error:
            logger.error(f"Transcription failed: {str(transcription_error)}")
            logger.error(f"Transcription error traceback: {traceback.format_exc()}")
            raise

        # Clean up transcript
        transcript = transcript.strip()

        # Build result JSON (matching existing format)
        result = {
            "transcript": transcript,
            "metadata": {
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "patient_id": patient_id,
                "session_type": session_type,
                "audio_file": os.path.basename(wav_file_path)
            }
        }

        # Store in database
        with database.db_cursor() as cursor:
            # Create session record (matching actual schema)
            cursor.execute(
                """INSERT INTO sessions (session_id, session_type, start_ts, notes)
                   VALUES (?, ?, ?, ?)""",
                (session_id, session_type, int(datetime.now().timestamp() * 1000), f"Patient: {patient_id}")
            )

            # Store audio chunk (check actual table structure)
            cursor.execute(
                """INSERT INTO audio_chunks (session_id, file_path, created_ts)
                   VALUES (?, ?, ?)""",
                (session_id, file_path, int(datetime.now().timestamp() * 1000))
            )

            # Store transcript
            cursor.execute(
                """INSERT INTO transcripts (session_id, text, created_ts)
                   VALUES (?, ?, ?)""",
                (session_id, transcript, int(datetime.now().timestamp() * 1000))
            )

        return JSONResponse(content=result)

    except Exception as e:
        # Clean up file if something went wrong
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(e)}")

@router.post("/process-session")
async def process_session(request_data: dict):
    """
    Take transcript data and run it through the AI analysis pipeline.
    This connects transcription to the AI summarization chains.
    """
    try:
        logger.info(f"Processing session with data: {request_data}")

        transcript = request_data.get("transcript")
        metadata = request_data.get("metadata", {})
        session_id = metadata.get("session_id")
        session_type = metadata.get("session_type", "freeform")

        logger.info(f"Extracted - transcript: {transcript[:100] if transcript else None}, session_id: {session_id}, session_type: {session_type}")

        if not transcript or not session_id:
            logger.error(f"Missing required data - transcript: {bool(transcript)}, session_id: {bool(session_id)}")
            raise HTTPException(status_code=400, detail="Missing transcript or session_id")

        # For now, create a simple mock analysis result
        # TODO: Integrate with the full 3-stage chain later
        analysis_result = {
            "summary": f"This {session_type} session was successfully recorded and transcribed. The transcript contains: {transcript[:100]}{'...' if len(transcript) > 100 else ''}",
            "tags": [session_type, "transcribed", "needs_full_analysis"],
            "mood_label": "Neutral",
            "agitation_score": 2,
            "suggestions": [
                "Review the full transcript for important details",
                "Consider the context and patient's current state",
                "Follow up as needed based on session content"
            ]
        }

        # Store analysis results in database (use INSERT OR REPLACE to handle duplicates)
        logger.info(f"Attempting to store analysis for session_id: {session_id}")
        with database.db_cursor() as cursor:
            try:
                cursor.execute(
                    """INSERT OR REPLACE INTO summaries (session_id, summary_text, mood_label,
                       agitation_score, suggestions, created_ts)
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (
                        session_id,
                        analysis_result.get("summary", ""),
                        analysis_result.get("mood_label", ""),
                        analysis_result.get("agitation_score", 0),
                        json.dumps(analysis_result.get("suggestions", [])),
                        int(datetime.now().timestamp() * 1000)
                    )
                )
                logger.info(f"Successfully stored analysis for session_id: {session_id}")
            except Exception as db_error:
                logger.error(f"Database error storing analysis: {str(db_error)}")
                logger.error(f"Database error traceback: {traceback.format_exc()}")
                raise

        return JSONResponse(content={
            "session_id": session_id,
            "analysis": analysis_result,
            "status": "completed"
        })

    except Exception as e:
        logger.error(f"Unhandled exception in process_session: {str(e)}")
        logger.error(f"Exception traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get complete session data including transcript and analysis."""
    try:
        with database.db_cursor() as cursor:
            # Get session info
            cursor.execute(
                "SELECT * FROM sessions WHERE session_id = ?", (session_id,)
            )
            session = cursor.fetchone()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")

            # Get transcript
            cursor.execute(
                "SELECT transcript_text FROM transcripts WHERE session_id = ?", (session_id,)
            )
            transcript_row = cursor.fetchone()
            transcript = transcript_row[0] if transcript_row else ""

            # Get analysis/summary
            cursor.execute(
                "SELECT * FROM summaries WHERE session_id = ?", (session_id,)
            )
            summary_row = cursor.fetchone()

            analysis = {}
            if summary_row:
                analysis = {
                    "summary": summary_row[2],  # summary_text
                    "tags": json.loads(summary_row[3]) if summary_row[3] else [],
                    "mood_label": summary_row[4],
                    "agitation_score": summary_row[5],
                    "suggestions": json.loads(summary_row[6]) if summary_row[6] else []
                }

            return JSONResponse(content={
                "session_id": session_id,
                "patient_id": session[1],
                "session_type": session[2],
                "created_at": session[3],
                "transcript": transcript,
                "analysis": analysis
            })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve session: {str(e)}")