#!/usr/bin/env python3
"""
Carelink Backend Server Startup Script
"""
import os
import sys


def main():
    """Start the Carelink FastAPI server."""
    print("🏥 Starting Carelink Backend Server...")
    print("📍 API will be available at: http://localhost:8000")
    print("📖 API docs will be available at: http://localhost:8000/docs")
    print("🔧 Health check: http://localhost:8000/health")
    print()

    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    if os.path.exists(backend_dir):
        os.chdir(backend_dir)

    # Run the server
    os.system("python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload")


if __name__ == "__main__":
    main()
