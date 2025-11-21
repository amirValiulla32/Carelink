# 🧠 Carelink

<div align="center">

**An offline-first AI-powered memory companion for caregivers supporting individuals with dementia and Alzheimer's**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Carelink is a privacy-first, offline-capable application designed to assist caregivers in tracking and analyzing interactions with dementia and Alzheimer's patients. By leveraging local speech-to-text processing and AI analysis, Carelink helps caregivers maintain detailed records, identify patterns, and receive insights without compromising patient privacy.

### Why Carelink?

- **🔒 Privacy-First**: All processing happens locally - no data leaves your device
- **📴 Offline-Capable**: Works without internet connectivity
- **🤖 AI-Powered**: Intelligent analysis of conversations and behavioral patterns
- **📊 Pattern Recognition**: Identifies trends in mood, agitation, and cognitive state
- **⏱️ Real-Time Transcription**: Instant audio-to-text conversion
- **📝 Comprehensive Logging**: Detailed session records for healthcare provider review

---

## ✨ Features

### Core Functionality
- **Audio Recording & Transcription**: Record caregiver-patient interactions with real-time speech-to-text conversion using whisper.cpp
- **Session Management**: Track different session types (Medication, Conversation, Meals, Activities, Sundowning)
- **AI-Powered Analysis**: Automatic summarization and sentiment analysis using local LLM (Deepseek v3.1 via Ollama)
- **Timeline View**: Visual timeline of all sessions with filtering and search capabilities
- **Mood & Agitation Tracking**: Monitor emotional states and behavioral patterns over time

### Session Types
- **Medication**: Track medication administration and patient responses
- **Conversation**: Record general conversations and cognitive engagement
- **Meals**: Monitor eating habits and mealtime behaviors
- **Activities**: Document daily activities and participation levels
- **Sundowning**: Track late-day confusion and behavioral changes

### Technical Features
- **Offline-First Architecture**: Full functionality without internet connection
- **Local Data Storage**: Encrypted SQLite database for secure data persistence
- **WebM to WAV Conversion**: Automatic audio format conversion using FFmpeg
- **Real-Time Audio Visualization**: Visual feedback during recording
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Eye-friendly interface for extended use

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)**: Modern Python web framework for building APIs
- **[SQLite](https://www.sqlite.org/)**: Lightweight, serverless database
- **[whisper.cpp](https://github.com/ggerganov/whisper.cpp)**: High-performance speech recognition
- **[FFmpeg](https://ffmpeg.org/)**: Audio/video processing
- **[Ollama](https://ollama.ai/)**: Local LLM server for AI analysis
- **Python 3.8+**: Core backend language

### Frontend
- **[Next.js 15.2](https://nextjs.org/)**: React framework with App Router
- **[React 19](https://react.dev/)**: UI library
- **[TypeScript 5](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)**: Accessible component library
- **[Recharts](https://recharts.org/)**: Data visualization
- **[Lucide React](https://lucide.dev/)**: Icon library

### AI & ML
- **whisper.cpp (base.en model)**: Offline speech-to-text transcription
- **Deepseek v3.1**: Local language model for text analysis and summarization
- **Ollama Runtime**: Manages local AI model execution

---

## 📋 Prerequisites

Before installing Carelink, ensure you have the following installed:

### Required
- **Python 3.8+**: [Download](https://www.python.org/downloads/)
- **Node.js 18+**: [Download](https://nodejs.org/)
- **npm or pnpm**: Package manager (npm comes with Node.js, or install pnpm: `npm install -g pnpm`)
- **CMake**: For building whisper.cpp ([Download](https://cmake.org/download/))
- **FFmpeg**: Audio processing ([Download](https://ffmpeg.org/download.html))
- **Ollama**: Local LLM runtime ([Download](https://ollama.ai/download))

### Platform-Specific
- **macOS**: Install Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: Install build essentials (`sudo apt-get install build-essential`)
- **Windows**: Install Visual Studio Build Tools

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Carelink.git
cd Carelink
```

### 2. Setup whisper.cpp
```bash
# Clone whisper.cpp
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build whisper.cpp
cmake -B build
cmake --build build -j --config Release

# Download the English model (360MB)
./models/download-ggml-model.sh base.en

cd ..
```

### 3. Setup Backend
```bash
# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
cd backend
python -c "import database; database.init_database()"
cd ..
```

### 4. Setup Ollama & AI Models
```bash
# Install Ollama from https://ollama.ai/download

# Pull the Deepseek v3.1 model
ollama pull deepseek-v3.1:671b-cloud

# Start Ollama service (keep running in separate terminal)
ollama serve
```

### 5. Setup Frontend
```bash
cd frontend

# Install dependencies (use npm or pnpm)
npm install
# or
pnpm install

cd ..
```

### 6. Configure Environment (Optional)
Create `.env` files if needed:

**Backend `.env`:**
```env
DATABASE_PATH=../db/carelink.db
WHISPER_MODEL_PATH=../whisper.cpp/models/ggml-base.en.bin
WHISPER_BINARY_PATH=../whisper.cpp/build/bin/main
OLLAMA_API_URL=http://localhost:11434
RECORDINGS_PATH=./recordings
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎮 Usage

### Starting the Application

#### 1. Start Backend Server
```bash
# From project root
python start_carelink.py

# Or manually
cd backend
source ../venv/bin/activate  # On Windows: ..\venv\Scripts\activate
python main.py
```

The backend API will be available at `http://localhost:8000`

#### 2. Start Frontend Development Server
```bash
# In a new terminal
cd frontend
npm run dev
# or
pnpm run dev
```

The frontend will be available at `http://localhost:3000`

#### 3. Ensure Ollama is Running
```bash
# In a separate terminal
ollama serve
```

### Using the Application

1. **Start a New Session**
   - Click "New Session" on the home page
   - Select session type (Medication, Conversation, etc.)
   - Enter session notes if desired

2. **Record Audio**
   - Click the microphone button to start recording
   - Speak clearly during the interaction
   - Click stop when finished

3. **View Transcription**
   - Audio is automatically transcribed using whisper.cpp
   - Transcript appears in real-time

4. **AI Analysis**
   - System automatically analyzes the session
   - View mood, agitation scores, and AI-generated summary
   - Review key events and patterns

5. **Session Timeline**
   - View all past sessions in chronological order
   - Filter by session type
   - Search by keywords
   - Export session data

---

## 📁 Project Structure

```
Carelink/
├── backend/                    # Python FastAPI backend
│   ├── routes/                 # API route handlers
│   │   ├── session.py         # Session management
│   │   ├── transcribe.py      # Audio transcription
│   │   ├── summarize.py       # AI analysis
│   │   ├── audio.py           # Audio file handling
│   │   └── *_chain.py         # Session-specific prompt chains
│   ├── prompts/               # AI prompt templates
│   ├── recordings/            # Audio file storage
│   ├── main.py                # FastAPI application entry
│   ├── database.py            # Database connection & setup
│   ├── models.py              # Pydantic data models
│   └── crud.py                # Database operations
│
├── frontend/                  # Next.js React frontend
│   ├── app/                   # Next.js 15 App Router
│   │   ├── page.tsx          # Home page
│   │   └── layout.tsx        # Root layout
│   ├── components/            # React components
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   │   └── useAudioRecorder.ts
│   ├── lib/                  # Utility functions
│   ├── carelink-app.tsx      # Main application component
│   └── package.json          # Frontend dependencies
│
├── db/                       # Database storage
│   ├── carelink.db          # SQLite database
│   └── schema.sql           # Database schema
│
├── whisper.cpp/             # Speech recognition (external)
│   ├── models/              # Whisper AI models
│   └── build/               # Compiled binaries
│
├── requirements.txt         # Python dependencies
├── start_carelink.py       # Application launcher
├── SETUP.md                # Detailed setup guide
├── FUTURE_EXPANSION_ROADMAP.md  # Development roadmap
└── README.md               # This file
```

---

## 💻 Development

### Running Tests

**Backend Tests**
```bash
cd backend
pytest
```

**Frontend Tests**
```bash
cd frontend
npm test
# or
pnpm test
```

### Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   source ../venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm run dev  # or: pnpm run dev
   ```

3. **Type Checking**
   ```bash
   # Frontend TypeScript
   cd frontend
   npm run build  # or: pnpm run build (checks types during build)
   ```

### Code Style

**Python (Backend)**
- Follow PEP 8 guidelines
- Use type hints where possible
- Document functions with docstrings

**TypeScript (Frontend)**
- Use ESLint and Prettier configurations
- Follow React best practices
- Use TypeScript strict mode

### Database Management

**View Database**
```bash
sqlite3 db/carelink.db
.tables
.schema sessions
SELECT * FROM sessions LIMIT 10;
```

**Reset Database**
```bash
cd backend
python -c "import database; database.init_database()"
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/Carelink.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Add tests for new features
   - Follow existing code style

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure CI checks pass

### Development Guidelines
- Write clear commit messages (follow [Conventional Commits](https://www.conventionalcommits.org/))
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting and type checks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **whisper.cpp**: High-performance speech recognition by [Georgi Gerganov](https://github.com/ggerganov)
- **Ollama**: Local LLM runtime for privacy-focused AI
- **shadcn/ui**: Beautiful and accessible component library
- **FastAPI**: Modern Python web framework
- **Next.js**: React framework for production

---

## 📞 Support

For questions, issues, or feedback:

- **Issues**: [GitHub Issues](https://github.com/yourusername/Carelink/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Carelink/discussions)
- **Email**: support@carelink.app

---

## ⚠️ Disclaimer

Carelink is a tool designed to assist caregivers and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.

---

<div align="center">

**Built with ❤️ for caregivers supporting individuals with dementia and Alzheimer's**

[⬆ Back to Top](#-carelink)

</div>
