import sqlite3
import uuid
import time
import json
from typing import List, Optional, Dict, Any
from database import db_cursor, db_connection
from models import SessionDB, AudioChunk, Transcript, Summary, SessionDetail, SessionListItem


def create_session(session_type: str, start_ts: int) -> str:
    """Create a new session and return the session_id."""
    session_id = str(uuid.uuid4())

    with db_cursor() as cursor:
        cursor.execute(
            "INSERT INTO sessions (session_id, session_type, start_ts) VALUES (?, ?, ?)",
            (session_id, session_type, start_ts)
        )

    return session_id


def get_session(session_id: str) -> Optional[SessionDB]:
    """Get a session by ID."""
    with db_cursor() as cursor:
        cursor.execute(
            "SELECT session_id, session_type, start_ts, end_ts, notes FROM sessions WHERE session_id = ?",
            (session_id,)
        )
        row = cursor.fetchone()

        if row:
            return SessionDB(
                session_id=row["session_id"],
                session_type=row["session_type"],
                start_ts=row["start_ts"],
                end_ts=row["end_ts"],
                notes=row["notes"]
            )
    return None


def update_session_end(session_id: str, end_ts: int, notes: Optional[str] = None) -> bool:
    """Update session end timestamp and notes."""
    with db_cursor() as cursor:
        cursor.execute(
            "UPDATE sessions SET end_ts = ?, notes = ? WHERE session_id = ?",
            (end_ts, notes, session_id)
        )
        return cursor.rowcount > 0


def insert_audio_chunk(session_id: str, file_path: str, duration_sec: Optional[int] = None) -> int:
    """Insert an audio chunk and return chunk_id."""
    created_ts = int(time.time() * 1000)

    with db_cursor() as cursor:
        cursor.execute(
            "INSERT INTO audio_chunks (session_id, file_path, duration_sec, created_ts) VALUES (?, ?, ?, ?)",
            (session_id, file_path, duration_sec, created_ts)
        )
        return cursor.lastrowid


def insert_transcript(session_id: str, text: str, chunk_id: Optional[int] = None,
                      language: Optional[str] = None) -> int:
    """Insert a transcript and return transcript_id."""
    created_ts = int(time.time() * 1000)
    word_count = len(text.split()) if text else 0

    with db_cursor() as cursor:
        cursor.execute(
            "INSERT INTO transcripts (session_id, chunk_id, text, language, word_count, created_ts) VALUES (?, ?, ?, ?, ?, ?)",
            (session_id, chunk_id, text, language, word_count, created_ts)
        )
        return cursor.lastrowid


def insert_summary(session_id: str, summary_text: str, repetition_json: Optional[List[Dict[str, Any]]] = None,
                   agitation_score: Optional[float] = None, mood_label: Optional[str] = None,
                   suggestions: Optional[str] = None) -> int:
    """Insert a summary and return summary_id."""
    created_ts = int(time.time() * 1000)
    repetition_json_str = json.dumps(
        repetition_json) if repetition_json else None

    with db_cursor() as cursor:
        cursor.execute(
            "INSERT INTO summaries (session_id, summary_text, repetition_json, agitation_score, mood_label, suggestions, created_ts) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (session_id, summary_text, repetition_json_str,
             agitation_score, mood_label, suggestions, created_ts)
        )
        return cursor.lastrowid


def get_session_detail(session_id: str) -> Optional[SessionDetail]:
    """Get full session details with all related data."""
    with db_connection() as conn:
        cursor = conn.cursor()

        # Get session
        cursor.execute(
            "SELECT session_id, session_type, start_ts, end_ts, notes FROM sessions WHERE session_id = ?",
            (session_id,)
        )
        session_row = cursor.fetchone()

        if not session_row:
            return None

        # Get audio chunks
        cursor.execute(
            "SELECT chunk_id, file_path, duration_sec, created_ts FROM audio_chunks WHERE session_id = ?",
            (session_id,)
        )
        audio_chunks = [
            AudioChunk(
                chunk_id=row["chunk_id"],
                file_path=row["file_path"],
                duration_sec=row["duration_sec"],
                created_ts=row["created_ts"]
            )
            for row in cursor.fetchall()
        ]

        # Get transcripts
        cursor.execute(
            "SELECT transcript_id, chunk_id, text, language, word_count, created_ts FROM transcripts WHERE session_id = ?",
            (session_id,)
        )
        transcripts = [
            Transcript(
                transcript_id=row["transcript_id"],
                chunk_id=row["chunk_id"],
                text=row["text"],
                language=row["language"],
                word_count=row["word_count"],
                created_ts=row["created_ts"]
            )
            for row in cursor.fetchall()
        ]

        # Get summary
        cursor.execute(
            "SELECT summary_id, summary_text, repetition_json, agitation_score, mood_label, suggestions, created_ts FROM summaries WHERE session_id = ?",
            (session_id,)
        )
        summary_row = cursor.fetchone()
        summary = None
        if summary_row:
            summary = Summary(
                summary_id=summary_row["summary_id"],
                summary_text=summary_row["summary_text"],
                repetition_json=summary_row["repetition_json"],
                agitation_score=summary_row["agitation_score"],
                mood_label=summary_row["mood_label"],
                suggestions=summary_row["suggestions"],
                created_ts=summary_row["created_ts"]
            )

        return SessionDetail(
            session_id=session_row["session_id"],
            session_type=session_row["session_type"],
            start_ts=session_row["start_ts"],
            end_ts=session_row["end_ts"],
            notes=session_row["notes"],
            audio_chunks=audio_chunks,
            transcripts=transcripts,
            summary=summary
        )


def get_sessions_list(limit: int = 100, offset: int = 0) -> List[SessionListItem]:
    """Get list of sessions with summary snippets."""
    with db_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                s.session_id, 
                s.session_type, 
                s.start_ts,
                SUBSTR(sum.summary_text, 1, 100) as summary_snippet
            FROM sessions s
            LEFT JOIN summaries sum ON s.session_id = sum.session_id
            ORDER BY s.start_ts DESC
            LIMIT ? OFFSET ?
        """, (limit, offset))

        return [
            SessionListItem(
                session_id=row["session_id"],
                session_type=row["session_type"],
                start_ts=row["start_ts"],
                summary_snippet=row["summary_snippet"]
            )
            for row in cursor.fetchall()
        ]


def delete_session(session_id: str) -> bool:
    """Delete a session (cascades to related tables)."""
    with db_cursor() as cursor:
        cursor.execute(
            "DELETE FROM sessions WHERE session_id = ?", (session_id,))
        return cursor.rowcount > 0


def get_session_transcripts(session_id: str) -> List[Transcript]:
    """Get all transcripts for a session."""
    with db_cursor() as cursor:
        cursor.execute(
            "SELECT transcript_id, chunk_id, text, language, word_count, created_ts FROM transcripts WHERE session_id = ? ORDER BY created_ts",
            (session_id,)
        )
        return [
            Transcript(
                transcript_id=row["transcript_id"],
                chunk_id=row["chunk_id"],
                text=row["text"],
                language=row["language"],
                word_count=row["word_count"],
                created_ts=row["created_ts"]
            )
            for row in cursor.fetchall()
        ]
