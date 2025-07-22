#!/usr/bin/env python3
"""
Test script to verify whisper.cpp integration with the backend.
This script tests the whisper_utils module and transcribe endpoint.
"""

import os
import sys
import requests
import time

# Add backend to path
backend_dir = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_dir)


def test_whisper_utils():
    """Test the whisper_utils module directly."""
    print("🧪 Testing whisper_utils module...")

    try:
        from backend.whisper_utils import ensure_whisper_setup, transcribe_audio_file

        # Test setup
        binary_path, model_path = ensure_whisper_setup()
        print(f"✅ Whisper binary found: {binary_path}")
        print(f"✅ Whisper model found: {model_path}")

        # Test transcription with sample audio
        sample_audio = os.path.join(os.path.dirname(__file__), "sample.wav")
        if os.path.exists(sample_audio):
            print("🎵 Testing transcription with sample.wav...")
            transcript = transcribe_audio_file(sample_audio)
            print(f"✅ Transcription successful: {transcript[:100]}...")
        else:
            print("⚠️  No sample.wav found, skipping transcription test")

        return True

    except Exception as e:
        print(f"❌ Whisper utils test failed: {e}")
        return False


def test_api_endpoints():
    """Test the API endpoints."""
    print("\n🌐 Testing API endpoints...")

    base_url = "http://localhost:8000"

    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False

        # Test whisper health endpoint
        response = requests.get(f"{base_url}/health/whisper")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Whisper health check: {data}")
        else:
            print(f"❌ Whisper health check failed: {response.status_code}")
            return False

        return True

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server. Make sure the server is running.")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False


def main():
    """Run all tests."""
    print("🚀 Testing Carelink Whisper.cpp Integration")
    print("=" * 50)

    # Test whisper utils
    utils_ok = test_whisper_utils()

    # Test API endpoints
    api_ok = test_api_endpoints()

    print("\n" + "=" * 50)
    if utils_ok and api_ok:
        print("🎉 All tests passed! Whisper.cpp integration is working.")
    else:
        print("❌ Some tests failed. Check the output above for details.")

    return 0 if (utils_ok and api_ok) else 1


if __name__ == "__main__":
    sys.exit(main())
