# Carelink

**Carelink** is an offline-first AI-powered memory companion for caregivers supporting individuals with dementia and Alzheimer’s.

🧠 Features
Record and track caregiver sessions (e.g., Medication, Conversation)

Transcribe audio using whisper.cpp

Summarize key events with Gemma 3n

Store data securely with local SQLite

🚀 Tech Stack
Python (FastAPI)

SQLite (encrypted local storage)

whisper.cpp (local speech-to-text)

Gemma 3n (local summarization model)

📦 Run Locally

working transcription branch is prompts-dylan, clone the whisper.cpp repo inside of the whisper folder, then build the whisper binary/model etc:

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
