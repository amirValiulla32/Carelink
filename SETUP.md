# Carelink Setup

## Prerequisites
- Python 3.8+
- Node.js 18+
- FFmpeg
- CMake

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/amirValiulla32/Carelink.git
cd Carelink
```

2. Set up whisper.cpp:
```bash
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
make -j
./models/download-ggml-model.sh base.en
cd ..
```

3. Set up backend:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up frontend:
```bash
cd frontend
npm install
cd ..
```

5. Run the application:
```bash
# Terminal 1 - Backend
source venv/bin/activate
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Audio Recording Requirements
- FFmpeg must be installed for WebM to WAV conversion
- whisper.cpp model (base.en) must be downloaded
- Microphone permissions required in browser