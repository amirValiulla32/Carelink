#!/usr/bin/env bash
set -e
mkdir -p whisper.cpp/build
cd whisper.cpp/build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
