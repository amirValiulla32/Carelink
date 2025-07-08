#!/usr/bin/env python3
import os
import sys
import subprocess
import requests

def ensure_model():
    """Download ggml-base.en.bin into whisper.cpp/models if it’s not already there."""
    repo_root = os.path.dirname(__file__)
    model_dir = os.path.join(repo_root, "whisper.cpp", "models")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "ggml-base.en.bin")
    if not os.path.isfile(model_path):
        print("⬇️  Downloading ggml-base.en.bin (2.8 GB)…")
        url = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/models/ggml-base.en.bin"
        r = requests.get(url, stream=True)
        r.raise_for_status()
        with open(model_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    return model_path

def ensure_whisper_built():
    """Configure & build whisper.cpp if needed, then return path to whisper-cli or main."""
    repo_root = os.path.dirname(__file__)
    wc_root   = os.path.join(repo_root, "whisper.cpp")
    build_dir = os.path.join(wc_root, "build")
    os.makedirs(build_dir, exist_ok=True)

    is_win = sys.platform.startswith("win")
    # Candidate binaries in priority order
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

    # Build if none exist
    if not any(os.path.isfile(p) for p in candidates):
        print("🔨 Building whisper.cpp…")
        subprocess.check_call(
            ["cmake", wc_root, "-DCMAKE_BUILD_TYPE=Release"],
            cwd=build_dir
        )
        build_cmd = ["cmake", "--build", ".", "--config", "Release"]
        if not is_win:
            build_cmd += ["--", f"-j{os.cpu_count() or 1}"]
        subprocess.check_call(build_cmd, cwd=build_dir)

    for p in candidates:
        if os.path.isfile(p):
            return p
    raise FileNotFoundError(f"No whisper binary found; looked at:\n" + "\n".join(candidates))

def main():
    # 1) Download model if needed
    model_path  = ensure_model()

    # 2) Build whisper.cpp if needed
    whisper_exe = ensure_whisper_built()

    # 3) Transcribe with no prints & no timestamps
    sample = os.path.join(os.path.dirname(__file__), "sample.wav")
    proc = subprocess.run(
        [
            whisper_exe,
            "--model",     model_path,
            "--file",      sample,
            "--no-prints",
            "--no-timestamps",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        text=True,
    )
    transcript = proc.stdout.strip()
    print(transcript)

    # 4) Simple assertion (adjust phrase to match your sample)
    if "this is an audio test" not in transcript.lower():
        print("✖️ Expected “this is an audio test” in the transcription!")
        sys.exit(1)

    print("✅ Test passed.")

if __name__ == "__main__":
    main()
