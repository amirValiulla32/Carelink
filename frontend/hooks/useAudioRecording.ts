"use client"

import { useState, useRef, useCallback } from 'react'

export interface AudioRecordingState {
  isRecording: boolean
  isProcessing: boolean
  error: string | null
  recordingDuration: number
}

export interface UseAudioRecordingReturn {
  state: AudioRecordingState
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  resetRecording: () => void
}

export function useAudioRecording(): UseAudioRecordingReturn {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isProcessing: false,
    error: null,
    recordingDuration: 0,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, isProcessing: true }))

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Optimized for whisper.cpp
        }
      })

      streamRef.current = stream
      audioChunksRef.current = []

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus' // Widely supported format
      })

      mediaRecorderRef.current = mediaRecorder

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, 'bytes')
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log('Total chunks now:', audioChunksRef.current.length)
        }
      }

      // Start recording with timeslice to ensure data collection
      mediaRecorder.start(100) // Collect data every 100ms for better reliability
      startTimeRef.current = Date.now()

      console.log('Started recording with MediaRecorder')

      // Update duration every 100ms
      intervalRef.current = setInterval(() => {
        const duration = Date.now() - startTimeRef.current
        setState(prev => ({ ...prev, recordingDuration: Math.floor(duration / 1000) }))
      }, 100)

      setState(prev => ({
        ...prev,
        isRecording: true,
        isProcessing: false,
        recordingDuration: 0,
      }))

    } catch (error) {
      console.error('Failed to start recording:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to access microphone. Please check permissions.',
        isProcessing: false,
      }))
      throw error
    }
  }, [])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        console.log('No mediaRecorder available')
        resolve(null)
        return
      }

      if (mediaRecorderRef.current.state === 'inactive') {
        console.log('MediaRecorder already inactive')
        resolve(null)
        return
      }

      console.log('Stopping recording, current chunks:', audioChunksRef.current.length)

      setState(prev => ({ ...prev, isProcessing: true }))

      // Clear duration interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Set up completion handler
      const handleStop = async () => {
        try {
          console.log('Recording stopped, chunks available:', audioChunksRef.current.length)

          if (audioChunksRef.current.length === 0) {
            console.error('No audio chunks available')
            setState(prev => ({
              ...prev,
              error: 'No audio data recorded',
              isProcessing: false,
              isRecording: false,
            }))
            resolve(null)
            return
          }

          // Create audio blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          console.log('Created blob with size:', audioBlob.size)

          if (audioBlob.size === 0) {
            console.error('Audio blob is empty')
            setState(prev => ({
              ...prev,
              error: 'No audio data recorded',
              isProcessing: false,
              isRecording: false,
            }))
            resolve(null)
            return
          }

          setState(prev => ({
            ...prev,
            isRecording: false,
            isProcessing: false,
          }))

          // Clean up stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
          }

          resolve(audioBlob)
        } catch (error) {
          console.error('Failed to process recording:', error)
          setState(prev => ({
            ...prev,
            error: 'Failed to process recording',
            isProcessing: false,
            isRecording: false,
          }))
          resolve(null)
        }
      }

      // Assign the handler
      mediaRecorderRef.current.onstop = handleStop

      // Request data before stopping to ensure we have chunks
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData()
        // Small delay to ensure data is collected before stopping
        setTimeout(() => {
          mediaRecorderRef.current?.stop()
        }, 100)
      } else {
        // Stop recording immediately if not in recording state
        mediaRecorderRef.current.stop()
      }
    })
  }, [])

  const resetRecording = useCallback(() => {
    // Clean up any ongoing recording
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Reset state
    setState({
      isRecording: false,
      isProcessing: false,
      error: null,
      recordingDuration: 0,
    })

    // Clear refs
    audioChunksRef.current = []
    mediaRecorderRef.current = null
  }, [state.isRecording])

  return {
    state,
    startRecording,
    stopRecording,
    resetRecording,
  }
}

// Helper function to convert webm to wav (optional)
async function convertToWav(webmBlob: Blob): Promise<Blob | null> {
  try {
    // For now, just return the original blob
    // You could implement WebAudio API conversion here if needed
    return webmBlob
  } catch (error) {
    console.error('Failed to convert audio format:', error)
    return null
  }
}