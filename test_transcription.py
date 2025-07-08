from backend.whisper_wrapper import transcribe_audio

if __name__ == "__main__":
    audio_path = "sample.wav"
    try:
        transcript = transcribe_audio(audio_path)
        print("Transcript: ")
        print(transcript)
    except Exception as e:
        print("Error:", e)
