import pytest
import json
import time
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from .main import app
from . import database
import os

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Setup test database."""
    # Use a test database
    database.DB_PATH = "test_carelink.db"
    database.init_database()
    yield
    # Cleanup
    if os.path.exists("test_carelink.db"):
        os.remove("test_carelink.db")


def test_root_endpoint():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Carelink API is running"


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_start_session():
    """Test starting a new session."""
    timestamp = int(time.time() * 1000)
    response = client.post("/api/start-session", json={
        "session_type": "conversation",
        "timestamp": timestamp
    })
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    return data["session_id"]


@patch('subprocess.run')
def test_transcribe_mock(mock_subprocess):
    """Test transcription with mocked whisper.cpp."""
    # Setup mock
    mock_subprocess.return_value = MagicMock(returncode=0, stderr="")

    # Create a session first
    session_id = test_start_session()

    # Mock file existence
    with patch('os.path.exists', return_value=True), \
            patch('builtins.open', create=True) as mock_open:
        mock_open.return_value.__enter__.return_value.read.return_value = "This is a test transcript."

        response = client.post("/api/transcribe", json={
            "session_id": session_id,
            "audio_path": "/fake/path/audio.wav"
        })

        assert response.status_code == 200
        data = response.json()
        assert "transcript" in data


@patch('requests.post')
def test_summarize_mock(mock_requests):
    """Test summarization with mocked Ollama API."""
    # Setup mock
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "response": json.dumps({
            "summary": "Test summary",
            "repetition_json": [{"phrase": "test", "count": 2}],
            "agitation_score": 3.0,
            "mood_label": "calm",
            "suggestions": "Test suggestions"
        })
    }
    mock_requests.return_value = mock_response

    # Create a session first
    session_id = test_start_session()

    response = client.post("/api/summarize", json={
        "session_id": session_id,
        "transcript": "This is a test transcript for summarization.",
        "session_type": "conversation"
    })

    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "agitation_score" in data
    assert "mood_label" in data


def test_store_session():
    """Test storing/finalizing a session."""
    # Create a session first
    session_id = test_start_session()

    timestamp = int(time.time() * 1000)
    response = client.post("/api/store-session", json={
        "session_id": session_id,
        "session_type": "conversation",
        "transcript": "Test transcript",
        "summary": "Test summary",
        "notes": "Test notes",
        "timestamp": timestamp
    })

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Session stored successfully"


def test_get_session():
    """Test retrieving a session."""
    # Create and store a session first
    session_id = test_start_session()
    test_store_session()

    response = client.get(f"/api/session/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == session_id
    assert "transcripts" in data
    assert "audio_chunks" in data


def test_get_sessions_list():
    """Test retrieving sessions list."""
    response = client.get("/api/sessions")
    assert response.status_code == 200
    data = response.json()
    assert "sessions" in data
    assert isinstance(data["sessions"], list)


def test_cascade_delete():
    """Test that deleting a session cascades to related tables."""
    # Create a session with data
    session_id = test_start_session()

    # Add some data
    with database.db_cursor() as cursor:
        # Add transcript
        cursor.execute(
            "INSERT INTO transcripts (session_id, text, created_ts) VALUES (?, ?, ?)",
            (session_id, "Test transcript", int(time.time() * 1000))
        )

        # Add audio chunk
        cursor.execute(
            "INSERT INTO audio_chunks (session_id, file_path, created_ts) VALUES (?, ?, ?)",
            (session_id, "/test/path", int(time.time() * 1000))
        )

    # Delete session
    response = client.delete(f"/api/session/{session_id}")
    assert response.status_code == 200

    # Verify cascade delete worked
    with database.db_cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM transcripts WHERE session_id = ?", (session_id,))
        assert cursor.fetchone()[0] == 0

        cursor.execute(
            "SELECT COUNT(*) FROM audio_chunks WHERE session_id = ?", (session_id,))
        assert cursor.fetchone()[0] == 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
