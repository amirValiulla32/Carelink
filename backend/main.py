import database
from routes import session, transcribe, summarize
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import sys

# Add the backend directory to Python path BEFORE importing local modules
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Now import local modules


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    database.init_database()
    yield

# Create FastAPI app
app = FastAPI(
    title="Carelink API",
    description="Offline dementia-care companion backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(session.router)
app.include_router(transcribe.router)
app.include_router(summarize.router)


@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "Carelink API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Test database connection
        with database.db_cursor() as cursor:
            cursor.execute("SELECT 1")

        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=503, detail=f"Database connection failed: {str(e)}")


@app.get("/health/whisper")
async def whisper_health_check():
    """Health check endpoint for whisper.cpp."""
    try:
        from whisper_utils import ensure_whisper_setup
        binary_path, model_path = ensure_whisper_setup()

        return {
            "status": "healthy",
            "whisper": "ready",
            "binary_path": binary_path,
            "model_path": model_path
        }
    except Exception as e:
        raise HTTPException(
            status_code=503, detail=f"Whisper setup failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
