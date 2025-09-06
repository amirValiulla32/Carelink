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

### Prerequisites
- Python 3.8+
- Node.js 18+ and pnpm
- CMake
- Ollama

### Setup Instructions

1. **Clone whisper.cpp** (required for offline speech recognition):
```bash
cd whisper
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build whisper.cpp
cmake -B build
cmake --build build -j --config Release

# Download the English model
./models/download-ggml-model.sh base.en
```

2. **Install Ollama and pull the AI model**:
```bash
# Install Ollama: https://ollama.ai/download
ollama pull gemma3n:latest
ollama serve
```

3. **Install dependencies**:
```bash
# Python dependencies
pip install -r requirements.txt

# Frontend dependencies
cd frontend
pnpm install
```

4. **Start the application**:
```bash
# Backend
python start_carelink.py

# Frontend (in another terminal)
cd frontend
pnpm run dev
```


for creating the local db for api/testing: 
```bash
sqlcipher carelink_enc.db
PRAGMA key = 'dev-pin-7864';
.read schema.sql


to run frontend locally:
cd frontend
pnpm install

pnpm run dev 
