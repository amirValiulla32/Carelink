# Carelink

**Carelink** is a small desktop app that helps caregivers keep gentle, private notes about each day with a loved one who has dementia.

working transcription branch is whisper-amir, clone the whisper.cpp repo inside of the whisper folder, then build the whisper binary/model etc:

cmake -B build
cmake --build build -j --config Release

./models/download-ggml-model.sh base.en


for creating the local db for api/testing: 
```bash
sqlcipher carelink_enc.db
PRAGMA key = 'dev-pin-7864';
.read schema.sql


to run frontend locally:
cd frontend
pnpm install

pnpm run dev 
