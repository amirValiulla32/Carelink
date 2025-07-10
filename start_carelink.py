#!/usr/bin/env python3
"""
Carelink Backend Startup Script
This script handles all import path issues and starts the server.
"""
import os
import sys
import subprocess


def setup_environment():
    """Setup the Python environment for running Carelink backend."""
    # Get the project root directory
    project_root = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(project_root, 'backend')

    # Add both directories to Python path
    sys.path.insert(0, project_root)
    sys.path.insert(0, backend_dir)

    # Change to backend directory
    os.chdir(backend_dir)

    return backend_dir


def install_dependencies():
    """Install required dependencies."""
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "../requirements.txt"],
                       check=True, capture_output=True)
        print(" Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f" Failed to install dependencies: {e}")
        return False
    return True


def start_server():
    """Start the FastAPI server."""
    print(" Starting Carelink Backend Server...")
    print(" API will be available at: http://localhost:8000")
    print(" API docs will be available at: http://localhost:8000/docs")
    print(" Health check: http://localhost:8000/health")
    print()

    try:
        # Use uvicorn directly
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "main:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        return False
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return True

    return True


def main():
    """Main function to start Carelink backend."""
    print("🚀 Carelink Backend Startup")
    print("=" * 40)

    # Setup environment
    backend_dir = setup_environment()

    # Check if backend directory exists
    if not os.path.exists(backend_dir):
        print(f"❌ Backend directory not found: {backend_dir}")
        return 1

    # Install dependencies
    if not install_dependencies():
        return 1

    # Start server
    if not start_server():
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
