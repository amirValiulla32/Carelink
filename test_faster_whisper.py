import os
import subprocess

from faster_whisper import WhisperModel

# ——— Python fallback model (loaded once) ———
_py_model = WhisperModel("tiny.en", device="cpu")


def transcribe_with_cpp(audio_path: str, model_path: str = None) -> str:
    """
    First try: use whisper.cpp's CLI (whisper-cli.exe).
    """
    project_root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )

    # Path to whisper-cli.exe in the Release folder
    cli = os.path.join(
        project_root, "whisper.cpp", "build", "bin", "Release", "whisper-cli.exe"
    )
    cli = os.path.abspath(cli)

    # Default model inside whisper.cpp/models
    if model_path:
        model = os.path.abspath(model_path)
    else:
        model = os.path.abspath(
            os.path.join(project_root, "whisper.cpp", "models", "ggml-base.en.bin")
        )

    audio = os.path.abspath(audio_path)

    # Sanity checks
    if not os.path.exists(cli):
        raise FileNotFoundError(f"Whisper CLI not found at: {cli}")
    if not os.path.exists(model):
        raise FileNotFoundError(f"Whisper model not found at: {model}")
    if not os.path.exists(audio):
        raise FileNotFoundError(f"Audio file not found at: {audio}")

    # Run the C++ CLI
    cmd = [
        cli,
        "--model", model,
        "--file", audio,
        "--output-txt",
        "--output-file", "output",
        "--print-progress",
        "--language", "en",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)

    # Debug output
    print("Whisper stdout:\n", result.stdout)
    print("Whisper stderr:\n", result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"Whisper CLI failed (exit code {result.returncode})")

    # Read and return the transcript
    out_txt = os.path.join(os.getcwd(), "output.txt")
    if not os.path.exists(out_txt):
        raise FileNotFoundError("Expected output.txt not found after transcription.")

    with open(out_txt, "r", encoding="utf-8") as f:
        return f.read()


def transcribe_audio(audio_path: str, model_path: str = None) -> str:
    """
    Try C++ first; if it errors, fall back to faster-whisper.
    """
    try:
        return transcribe_with_cpp(audio_path, model_path)
    except Exception as e:
        print("⚠️ C++ transcription failed, falling back to faster-whisper:", e)
        segments, _ = _py_model.transcribe(audio_path, beam_size=5)
        return "".join(seg.text for seg in segments)
