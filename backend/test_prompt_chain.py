#!/usr/bin/env python3
"""
Test script for the three-stage prompt chaining system.
This demonstrates how to use the new API endpoints for medication sessions.
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"


def test_medication_prompt_chain():
    """Test the three-stage prompt chain for medication sessions."""

    # Sample transcript for testing
    sample_transcript = """
    Caregiver: "Good morning, it's time for your morning medications."
    Patient: "What time is it?"
    Caregiver: "It's 9:00 AM. Here are your pills: aspirin, blood pressure medication, and your vitamin."
    Patient: "Do I have to take all of them?"
    Caregiver: "Yes, these are important for your health. Let's take them one by one."
    Patient: "What time is it again?"
    Caregiver: "It's still 9:00 AM. Here's your aspirin first."
    Patient: "Okay, I'll take it." [takes aspirin]
    Caregiver: "Great! Now here's your blood pressure medication."
    Patient: "What time is it?"
    Caregiver: "It's 9:05 AM now. Let's take this medication."
    Patient: "Alright." [takes blood pressure medication]
    Caregiver: "Perfect! And finally, your vitamin."
    Patient: "What time is it?"
    Caregiver: "It's 9:07 AM. This is your last pill for now."
    Patient: "Okay, done." [takes vitamin]
    Caregiver: "Excellent! All medications taken. How are you feeling?"
    Patient: "I'm okay. Can I have breakfast now?"
    Caregiver: "Of course! Let's get you some breakfast."
    """

    print("🧪 Testing Medication Prompt Chain")
    print("=" * 50)

    # Step 1: Extract structured data
    print("\n📋 Step 1: Extracting structured data...")
    extract_response = requests.post(
        f"{BASE_URL}/api/medication/extract",
        json={"transcript": sample_transcript}
    )

    if extract_response.status_code == 200:
        extracted_data = extract_response.json()["data"]
        print("✅ Extraction successful!")
        print(f"📊 Extracted data: {json.dumps(extracted_data, indent=2)}")
    else:
        print(f"❌ Extraction failed: {extract_response.status_code}")
        print(extract_response.text)
        return

    # Step 2: Analyze the extracted data
    print("\n🔍 Step 2: Analyzing extracted data...")
    analyze_response = requests.post(
        f"{BASE_URL}/api/medication/analyze",
        json={"extracted_data": extracted_data}
    )

    if analyze_response.status_code == 200:
        analyzed_data = analyze_response.json()["data"]
        print("✅ Analysis successful!")
        print(f"📊 Analyzed data: {json.dumps(analyzed_data, indent=2)}")
    else:
        print(f"❌ Analysis failed: {analyze_response.status_code}")
        print(analyze_response.text)
        return

    # Step 3: Generate final summary
    print("\n📝 Step 3: Generating final summary...")
    summarize_response = requests.post(
        f"{BASE_URL}/api/medication/summarize",
        json={
            "session_id": "test-session-123",
            "extracted_data": extracted_data,
            "analyzed_data": analyzed_data
        }
    )

    if summarize_response.status_code == 200:
        summary_data = summarize_response.json()
        print("✅ Summarization successful!")
        print(f"📊 Final summary: {json.dumps(summary_data, indent=2)}")
    else:
        print(f"❌ Summarization failed: {summarize_response.status_code}")
        print(summarize_response.text)
        return

    print("\n🎉 All three stages completed successfully!")
    print("=" * 50)


def test_freeform_prompt_chain():
    """Test the three-stage prompt chain for freeform sessions."""

    # Sample transcript for testing
    sample_transcript = """
    Caregiver: "How are you feeling today?"
    Patient: "I'm doing okay. I was thinking about my family."
    Caregiver: "That's nice! Tell me about your family."
    Patient: "I have two children. My daughter lives in the city."
    Caregiver: "That sounds wonderful. What does your daughter do?"
    Patient: "She's a teacher. She teaches children."
    Caregiver: "That's a very important job. Do you see her often?"
    Patient: "What day is it today?"
    Caregiver: "It's Thursday. Do you remember when you last saw your daughter?"
    Patient: "I think it was last week. She brought me some flowers."
    Caregiver: "That's very thoughtful of her. What kind of flowers?"
    Patient: "What day is it again?"
    Caregiver: "It's Thursday. The flowers your daughter brought you?"
    Patient: "Oh yes, they were yellow roses. My favorite color."
    Caregiver: "Yellow roses are beautiful. Do you have any photos of your family?"
    Patient: "I think so. In my room. What day is it?"
    Caregiver: "It's Thursday. Would you like to look at some family photos?"
    Patient: "Yes, that would be nice."
    """

    print("\n🧪 Testing Freeform Prompt Chain")
    print("=" * 50)

    # Step 1: Extract structured data
    print("\n📋 Step 1: Extracting structured data...")
    extract_response = requests.post(
        f"{BASE_URL}/api/freeform/extract",
        json={"transcript": sample_transcript}
    )

    if extract_response.status_code == 200:
        extracted_data = extract_response.json()["data"]
        print("✅ Extraction successful!")
        print(f"📊 Extracted data: {json.dumps(extracted_data, indent=2)}")
    else:
        print(f"❌ Extraction failed: {extract_response.status_code}")
        print(extract_response.text)
        return

    # Step 2: Analyze the extracted data
    print("\n🔍 Step 2: Analyzing extracted data...")
    analyze_response = requests.post(
        f"{BASE_URL}/api/freeform/analyze",
        json={"extracted_data": extracted_data}
    )

    if analyze_response.status_code == 200:
        analyzed_data = analyze_response.json()["data"]
        print("✅ Analysis successful!")
        print(f"📊 Analyzed data: {json.dumps(analyzed_data, indent=2)}")
    else:
        print(f"❌ Analysis failed: {analyze_response.status_code}")
        print(analyze_response.text)
        return

    # Step 3: Generate final summary
    print("\n📝 Step 3: Generating final summary...")
    summarize_response = requests.post(
        f"{BASE_URL}/api/freeform/summarize",
        json={
            "session_id": "test-freeform-123",
            "extracted_data": extracted_data,
            "analyzed_data": analyzed_data
        }
    )

    if summarize_response.status_code == 200:
        summary_data = summarize_response.json()
        print("✅ Summarization successful!")
        print(f"📊 Final summary: {json.dumps(summary_data, indent=2)}")
    else:
        print(f"❌ Summarization failed: {summarize_response.status_code}")
        print(summarize_response.text)
        return

    print("\n🎉 All three stages completed successfully!")
    print("=" * 50)


if __name__ == "__main__":
    print("🚀 Starting Prompt Chain Tests")
    print("Make sure your FastAPI server is running on http://localhost:8000")
    print("Make sure Ollama is running with gemma3n:latest model")
    print("=" * 50)

    try:
        # Test medication chain
        test_medication_prompt_chain()

        # Test freeform chain
        test_freeform_prompt_chain()

        print("\n✅ All tests completed!")

    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server.")
        print("Make sure your FastAPI server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
