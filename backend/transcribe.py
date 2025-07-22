from pathlib import Path
import subprocess
import sys

WHISPER_BINARY = Path(__file__).parents[1] / "whisper" / "whisper.cpp" / "build" / "bin" / "whisper-cli"
MODEL_PATH     = Path(__file__).parents[1] / "whisper" / "whisper.cpp" / "models" / "ggml-base.en.bin"

def transcribe_audio(audio_path: str) -> str:
    # Convert string path to Path object
    audio_path = Path(audio_path)
    
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

    def transcribe_audio(wav_path: str) -> str:
        audio_path = Path(wav_path)
    
        assert WHISPER_BINARY.exists(), " Whisper binary not built!"
        assert audio_path.exists(), f" File not found: {audio_path}"
        
        command = [
            str(WHISPER_BINARY),
            "-m", str(MODEL_PATH),
            "-f", str(audio_path),
            "-otxt"  # writes transcript to .txt file in same dir
        ]
        
        result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode != 0:
            raise RuntimeError(f"Transcription failed: {result.stderr}")
        
        # Read generated transcript
        txt_path = audio_path.with_suffix(".txt")
        return txt_path.read_text().strip()