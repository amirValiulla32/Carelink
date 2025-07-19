import sounddevice as sd
from scipy.io.wavfile import write
import os
from datetime import datetime
from transcribe import transcribe_audio
import uuid
import json

# Settings for whisper.cpp
SAMPLE_RATE = 16000  # 16 kHz
CHANNELS = 1         # mono
DURATION = 10        # in seconds

def record_to_wav(output_dir="recordings", filename=None):
    os.makedirs(output_dir, exist_ok=True)

    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"recording_{timestamp}.wav"

    path = os.path.join(output_dir, filename)

    print(f" Recording for {DURATION} seconds...")
    recording = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=CHANNELS, dtype='int16')
    sd.wait()
    write(path, SAMPLE_RATE, recording)
    print(f" Saved to {path}")

    return path, filename 


def record_and_transcribe(patient_id="default_patient"):
    wav_path, filename = record_to_wav()
    transcript = transcribe_audio(wav_path)
    
    # Clean up transcript - remove leading/trailing whitespace and newlines
    transcript = transcript.strip()

    # Extract session_id and timestamp from filename
    base_filename = filename.replace(".wav", "")
    parts = base_filename.split("_")
    
    session_id = base_filename
    timestamp_raw = parts[1] + parts[2]
    timestamp = datetime.strptime(timestamp_raw, "%Y%m%d%H%M%S").isoformat()

    # Build final JSON
    result = {
        "transcript": transcript,
        "metadata": {
            "session_id": session_id,
            "timestamp": timestamp,
            "patient_id": patient_id
        }
    }

    print("Final Payload:")
    print(json.dumps(result, indent=2))

    return result

if __name__ == "__main__":
    record_and_transcribe()