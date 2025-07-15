from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


# Request Models


class StartSessionRequest(BaseModel):
    session_type: str
    timestamp: int = Field(..., description="Timestamp in milliseconds")


class TranscribeRequest(BaseModel):
    session_id: str
    audio_path: str


class SummarizeRequest(BaseModel):
    session_id: str
    transcript: str
    session_type: str


class StoreSessionRequest(BaseModel):
    session_id: str
    session_type: str
    transcript: str
    summary: str
    notes: Optional[str] = None
    timestamp: int = Field(..., description="End timestamp in milliseconds")


# Prompt Chaining Request/Response Models


class ExtractRequest(BaseModel):
    transcript: str


class ExtractResponse(BaseModel):
    data: Dict[str, Any]


class AnalyzeRequest(BaseModel):
    extracted_data: Dict[str, Any]


class AnalyzeResponse(BaseModel):
    data: Dict[str, Any]


class ChainSummarizeRequest(BaseModel):
    session_id: str
    extracted_data: Dict[str, Any]
    analyzed_data: Dict[str, Any]


class SummarizeResponse(BaseModel):
    summary: str
    tone: str
    repeated_questions: List[str]
    key_moments: List[str]
    tags: List[str]
    agitation_score: float
    mood_label: str

# Response Models


class StartSessionResponse(BaseModel):
    session_id: str


class TranscribeResponse(BaseModel):
    transcript: str


class AudioChunk(BaseModel):
    chunk_id: int
    file_path: str
    duration_sec: Optional[int]
    created_ts: int


class Transcript(BaseModel):
    transcript_id: int
    chunk_id: Optional[int]
    text: str
    language: Optional[str]
    word_count: Optional[int]
    created_ts: int


class Summary(BaseModel):
    summary_id: int
    summary_text: str
    repetition_json: Optional[str]
    agitation_score: Optional[float]
    mood_label: Optional[str]
    suggestions: Optional[str]
    created_ts: int


class SessionDetail(BaseModel):
    session_id: str
    session_type: str
    start_ts: int
    end_ts: Optional[int]
    notes: Optional[str]
    audio_chunks: List[AudioChunk]
    transcripts: List[Transcript]
    summary: Optional[Summary]


class SessionListItem(BaseModel):
    session_id: str
    session_type: str
    start_ts: int
    summary_snippet: Optional[str] = None


class SessionListResponse(BaseModel):
    sessions: List[SessionListItem]

# Database Models (for internal use)


class SessionDB(BaseModel):
    session_id: str
    session_type: str
    start_ts: int
    end_ts: Optional[int]
    notes: Optional[str]
