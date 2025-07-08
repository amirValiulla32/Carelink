#!/usr/bin/env bash
set -e
MODEL_DIR="whisper.cpp/models"
mkdir -p "$MODEL_DIR"
if [ ! -f "$MODEL_DIR/ggml-base.en.bin" ]; then
  echo "⬇️  Downloading ggml-base.en.bin (2.8 GB)…"
  curl -L \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/models/ggml-base.en.bin \
    -o "$MODEL_DIR/ggml-base.en.bin"
fi
