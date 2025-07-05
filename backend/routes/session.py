# /start-session, /store-session, /session/{id}, /sessions

from models import (
    StartSessionRequest, StartSessionResponse,
    StoreSessionRequest, SessionDetail, SessionListResponse,
    SessionListItem
)
import crud
from fastapi import APIRouter, HTTPException, status
from typing import List


router = APIRouter(prefix="/api", tags=["sessions"])


@router.post("/start-session", response_model=StartSessionResponse)
async def start_session(request: StartSessionRequest):
    """Start a new session and return session_id."""
    try:
        session_id = crud.create_session(
            request.session_type, request.timestamp)
        return StartSessionResponse(session_id=session_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create session: {str(e)}"
        )


@router.post("/store-session")
async def store_session(request: StoreSessionRequest):
    """Finalize a session by updating end timestamp, notes, and storing summary."""
    try:
        # Check if session exists
        session = crud.get_session(request.session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Update session end timestamp and notes
        success = crud.update_session_end(
            request.session_id,
            request.timestamp,
            request.notes
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update session"
            )

        # Store the transcript if provided
        if request.transcript:
            crud.insert_transcript(request.session_id, request.transcript)

        # Store the summary if provided
        if request.summary:
            crud.insert_summary(request.session_id, request.summary)

        return {"message": "Session stored successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store session: {str(e)}"
        )


@router.get("/session/{session_id}", response_model=SessionDetail)
async def get_session(session_id: str):
    """Get full session details including transcripts and summary."""
    try:
        session_detail = crud.get_session_detail(session_id)
        if not session_detail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        return session_detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve session: {str(e)}"
        )


@router.get("/sessions", response_model=SessionListResponse)
async def get_sessions(limit: int = 100, offset: int = 0):
    """Get list of sessions with summary snippets."""
    try:
        sessions = crud.get_sessions_list(limit, offset)
        return SessionListResponse(sessions=sessions)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve sessions: {str(e)}"
        )


@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and all related data."""
    try:
        success = crud.delete_session(session_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        return {"message": "Session deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete session: {str(e)}"
        )
