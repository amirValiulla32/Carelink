import sounddevice as sd
from scipy.io.wavfile import write
import os
from datetime import datetime
from transcribe import transcribe_audio
import uuid

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

def record_and_transcribe():
    wav_path = record_to_wav()
    transcript = transcribe_audio(wav_path)
    print("Transcription:", transcript)
    return transcript

if __name__ == "__main__":
    record_and_transcribe()