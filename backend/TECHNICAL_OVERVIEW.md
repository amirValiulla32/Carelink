# Carelink Backend Technical Overview

## Architecture Overview
The Carelink backend implements a sophisticated prompt chaining system designed to process and analyze different types of care session transcripts. The system uses a three-stage pipeline architecture for processing transcripts, combining LLM-powered analysis with structured data extraction.

## Core Components

### 1. Prompt Chain Architecture
Each transcript processing pipeline consists of three sequential stages:

1. **Extract Stage**: Processes raw transcript into structured data
2. **Analyze Stage**: Performs in-depth analysis of extracted data
3. **Summarize Stage**: Generates concise, actionable summaries

### 2. Chain Types
The system supports three specialized chain types:

- **Medication Chain**: Focused on medication-related discussions and compliance
- **Freeform Chain**: Handles general care session discussions
- **Sundowning Chain**: Specifically analyzes sundowning symptoms and behaviors

### 3. Prompt Templates
Located in `/backend/prompts/`, each chain type has dedicated JSON templates:
```
prompts/
├── medication_extract.json
├── medication_analyze.json
├── medication_summary.json
├── freeform_extract.json
├── freeform_analyze.json
├── freeform_summary.json
├── sundowning_extract.json
├── sundowning_analyze.json
└── sundowning_summary.json
```

## API Interface

### Endpoints

#### 1. Medication Chain
```
POST /api/chain/medication
```
Request Body:
```json
{
    "transcript": "string",
    "metadata": {
        "session_id": "string",
        "timestamp": "string",
        "patient_id": "string"
    }
}
```

#### 2. Freeform Chain
```
POST /api/chain/freeform
```
Request Body:
```json
{
    "transcript": "string",
    "session_type": "string",
    "metadata": {
        "session_id": "string",
        "timestamp": "string",
        "patient_id": "string"
    }
}
```

#### 3. Sundowning Chain
```
POST /api/chain/sundowning
```
Request Body:
```json
{
    "transcript": "string",
    "symptoms": ["string"],
    "metadata": {
        "session_id": "string",
        "timestamp": "string",
        "patient_id": "string"
    }
}
```

### Response Format
All endpoints return a standardized JSON response:
```json
{
    "success": boolean,
    "data": {
        "summary": "string",
        "extracted_data": {},
        "analysis": {}
    },
    "error": "string"  // Only present if success is false
}
```

## LLM Integration

### Model Configuration
- Uses Ollama API
- Model: gemma3n
- Endpoint: http://localhost:11434/api/generate

### API Parameters
```json
{
    "model": "gemma3n:latest",
    "prompt": "string",
    "stream": false
}
```

## Error Handling

The system implements comprehensive error handling for:
- API connection failures
- Template loading errors
- Response parsing issues
- Timeout scenarios
- Invalid input validation

## Testing

### Test Coverage
Located in `/backend/test_prompt_chain.py`, tests cover:
- Chain execution flow
- Template loading
- API integration
- Error handling
- Response validation

### Test Data
Includes sample transcripts for each chain type to ensure consistent processing.

## Database Integration

The system uses SQLite for persistence:
- Database file: `carelink.db`
- Schema: Defined in `db/schema.sql`
- CRUD operations: Implemented in `backend/crud.py`

## Dependencies
Key dependencies include:
- FastAPI for API framework
- SQLAlchemy for database operations
- Pydantic for data validation
- Requests for API communication

## Deployment Considerations

### Environment Setup
1. Ensure Ollama is running and accessible
2. Configure database connection
3. Load prompt templates
4. Initialize FastAPI application

### Performance
- API timeout set to 60 seconds
- Implements connection pooling for database operations
- Caches prompt templates for improved performance
