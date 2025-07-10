import subprocess
import sys
from pathlib import Path

WHISPER_BINARY = Path(__file__).parents[1] / "whisper" / "whisper.cpp" / "build" / "bin" / "whisper-cli"
MODEL_PATH     = Path(__file__).parents[1] / "whisper" / "whisper.cpp" / "models" / "ggml-base.en.bin"

def transcribe_audio(audio_path: Path) -> str:
    """
    Runs whisper.cpp on the given WAV file and returns the transcribed text.
    """
    assert audio_path.exists(), f"File not found: {audio_path}"
    assert WHISPER_BINARY.exists(), "Whisper binary not built!"
    assert MODEL_PATH.exists(), "Model not downloaded!"

    result = subprocess.run([
        str(WHISPER_BINARY),
        "-m", str(MODEL_PATH),
        "-f", str(audio_path)
    ], capture_output=True, text=True)

    if result.returncode != 0:
        print("Whisper failed:")
        print(result.stderr)
        return ""

    return result.stdout

# --- CLI usage ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py path/to/audio.wav")
        sys.exit(1)

    audio_file = Path(sys.argv[1])
    output = transcribe_audio(audio_file)
    print("\n TRANSCRIPTION RESULT:")
    print(output)