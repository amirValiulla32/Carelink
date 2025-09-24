import database
from routes import session, transcribe, summarize, medication_chain, freeform_chain, sundowning_chain, audio
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import sys
import logging
import traceback

# Add the backend directory to Python path BEFORE importing local modules
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Configure comprehensive logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('carelink_debug.log')
    ]
)
logger = logging.getLogger(__name__)

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

# Global exception handler for debugging
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler to log all unhandled exceptions with full traceback."""
    tb_str = traceback.format_exc()
    error_msg = f"Unhandled exception in {request.method} {request.url.path}: {str(exc)}"

    logger.error(f"{error_msg}\n{tb_str}")

    # Return detailed error in development mode
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal server error: {str(exc)}",
            "traceback": tb_str,
            "path": str(request.url.path),
            "method": request.method
        }
    )

# Include routers
app.include_router(session.router)
app.include_router(transcribe.router)
app.include_router(summarize.router)
app.include_router(audio.router)

# Include prompt chaining routers
app.include_router(medication_chain.router)
app.include_router(freeform_chain.router)
app.include_router(sundowning_chain.router)


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
