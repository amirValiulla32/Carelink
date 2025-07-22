import os
import subprocess

def transcribe_audio(audio_path: str, model_path: str = None) -> str:
    """
    Transcribes the given audio file using whisper.cpp's whisper-cli.exe via subprocess.

    Args:
        audio_path (str): Path to the .wav audio file.
        model_path (str, optional): Path to the Whisper model file. 
            If not provided, defaults to whisper.cpp/models/ggml-base.en.bin.

    Returns:
        str: The transcribed text.
    """
    # Base directory = project root (where 'backend/' and 'whisper.cpp/' live)
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # 1) Locate the CLI binary
    import platform
    if platform.system() == "Windows":
        cli = os.path.join(project_root, "whisper.cpp", "build", "bin", "Release", "whisper-cli.exe")
    else:
        cli = os.path.join(project_root, "whisper.cpp", "build", "main")
    cli = os.path.abspath(cli)

    # 2) Locate the model file (default if not overridden)
    if model_path:
        model = os.path.abspath(model_path)
    else:
        model = os.path.abspath(
            os.path.join(project_root, "whisper.cpp", "models", "ggml-base.en.bin")
        )

    # 3) Absolute path to the audio file
    audio = os.path.abspath(audio_path)

    # Sanity checks
    if not os.path.exists(cli):
        raise FileNotFoundError(f"Whisper CLI not found at: {cli}")
    if not os.path.exists(model):
        raise FileNotFoundError(f"Whisper model not found at: {model}")
    if not os.path.exists(audio):
        raise FileNotFoundError(f"Audio file not found at: {audio}")

    # 4) Build and run the CLI command
    cmd = [
        cli,
        "--model",        model,
        "--file",         audio,
        "--output-txt",
        "--output-file",  "output",
        "--print-progress",
        "--language",     "en",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)

    # Debug prints
    print("Whisper stdout:\n", result.stdout)
    print("Whisper stderr:\n", result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"Whisper CLI failed (exit {result.returncode}):\n{result.stderr}")

    # 5) Load and return the transcript
    out_txt = os.path.join(os.getcwd(), "output.txt")
    if not os.path.exists(out_txt):
        raise FileNotFoundError("Expected output.txt not found after transcription.")

    with open(out_txt, "r", encoding="utf-8") as f:
        return f.read()
