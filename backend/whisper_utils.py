"""
Whisper.cpp utilities for offline speech transcription.
Provides centralized functions for building, locating, and using whisper.cpp.
"""

import os
import sys
import subprocess
import tempfile
from typing import Optional
from fastapi import HTTPException, status


def get_whisper_binary() -> str:
    """Get the path to the whisper binary, building if necessary."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    whisper_root = os.path.join(project_root, "whisper.cpp")
    build_dir = os.path.join(whisper_root, "build")

    # Ensure build directory exists
    os.makedirs(build_dir, exist_ok=True)

    # Platform-specific binary paths
    is_win = sys.platform.startswith("win")
    if is_win:
        candidates = [
            os.path.join(build_dir, "bin", "Release", "whisper-cli.exe"),
            os.path.join(build_dir, "bin", "Release", "main.exe"),
        ]
    else:
        candidates = [
            os.path.join(build_dir, "whisper-cli"),
            os.path.join(build_dir, "main"),
        ]

    # Check if any binary exists
    for candidate in candidates:
        if os.path.isfile(candidate):
            return candidate

    # Build if no binary found
    print("🔨 Building whisper.cpp...")
    try:
        subprocess.check_call(
            ["cmake", whisper_root, "-DCMAKE_BUILD_TYPE=Release"],
            cwd=build_dir
        )
        build_cmd = ["cmake", "--build", ".", "--config", "Release"]
        if not is_win:
            build_cmd += ["--", f"-j{os.cpu_count() or 1}"]
        subprocess.check_call(build_cmd, cwd=build_dir)

        # Check again after build
        for candidate in candidates:
            if os.path.isfile(candidate):
                return candidate
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to build whisper.cpp: {str(e)}"
        )

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Whisper binary not found after build"
    )


def get_model_path() -> str:
    """Get the path to the whisper model."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_dir = os.path.join(project_root, "whisper.cpp", "models")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "ggml-base.en.bin")

    if not os.path.isfile(model_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Whisper model not found. Please run fetch_model.sh first."
        )

    return model_path


def transcribe_audio_file(audio_path: str, language: str = "en") -> str:
    """
    Transcribe an audio file using whisper.cpp.

    Args:
        audio_path: Path to the audio file
        language: Language code (default: "en")

    Returns:
        Transcribed text

    Raises:
        HTTPException: If transcription fails
    """
    try:
        # Verify audio file exists
        if not os.path.exists(audio_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audio file not found"
            )

        # Get whisper binary and model
        whisper_exe = get_whisper_binary()
        model_path = get_model_path()

        # Create temporary file for transcript output
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.txt', delete=False) as tmp_file:
            tmp_txt_path = tmp_file.name

        try:
            # Call whisper.cpp for transcription
            whisper_cmd = [
                whisper_exe,
                "--model", model_path,
                "--file", audio_path,
                "--output-txt",
                "--output-file", "output",
                "--print-progress",
                "--language", language,
            ]

            result = subprocess.run(
                whisper_cmd,
                capture_output=True,
                text=True,
                timeout=300,  # 5 minute timeout
                cwd=os.getcwd()  # Run in current working directory
            )

            if result.returncode != 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Whisper transcription failed: {result.stderr}"
                )

            # Read transcription result from output.txt
            output_txt = os.path.join(os.getcwd(), "output.txt")
            transcript_text = ""
            if os.path.exists(output_txt):
                with open(output_txt, 'r', encoding='utf-8') as f:
                    transcript_text = f.read().strip()
                # Clean up output file
                os.unlink(output_txt)

            if not transcript_text:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="No transcription text generated"
                )

            return transcript_text

        finally:
            # Clean up temporary file
            if os.path.exists(tmp_txt_path):
                os.unlink(tmp_txt_path)

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Transcription timed out"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed: {str(e)}"
        )


def ensure_whisper_setup() -> tuple[str, str]:
    """
    Ensure whisper.cpp is set up and return binary and model paths.
    Useful for initialization checks.

    Returns:
        Tuple of (binary_path, model_path)
    """
    binary_path = get_whisper_binary()
    model_path = get_model_path()
    return binary_path, model_path
