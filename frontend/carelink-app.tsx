"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Clock,
  Heart,
  Pill,
  Coffee,
  Sunset,
  FileText,
  ArrowLeft,
  RotateCcw,
  Edit3,
  Tag,
  Shield,
  Sun,
  TrendingUp,
  Sparkles,
  X,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Screen = "home" | "session-type" | "session-confirm" | "session-summary"
type SessionType = "medication" | "sundowning" | "freeform" | null

// Audio Waveform Component
const AudioWaveform = ({ isListening, isRecording }: { isListening: boolean; isRecording: boolean }) => {
  const [audioData, setAudioData] = useState<number[]>(new Array(12).fill(0))
  const animationRef = useRef<number>()

  useEffect(() => {
    if (isListening) {
      const animate = () => {
        // Simulate audio input with gentle, organic movement
        const newData = audioData.map((_, index) => {
          const baseHeight = 0.2 + Math.sin(Date.now() * 0.002 + index * 0.5) * 0.1
          const randomVariation = Math.random() * 0.3
          const recordingBoost = isRecording ? Math.random() * 0.4 : 0
          return Math.max(0.1, Math.min(1, baseHeight + randomVariation + recordingBoost))
        })
        setAudioData(newData)
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      // Gentle fade to silence
      const fadeOut = () => {
        setAudioData((prev) => prev.map((val) => Math.max(0.05, val * 0.95)))
        if (audioData.some((val) => val > 0.1)) {
          setTimeout(fadeOut, 50)
        }
      }
      fadeOut()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isListening, isRecording])

  return (
    <div className="flex items-end justify-center gap-1 h-24 w-48">
      {audioData.map((height, index) => (
        <div
          key={index}
          className="transition-all duration-100 ease-out rounded-full"
          style={{
            width: "8px",
            height: `${height * 80}px`,
            backgroundColor: isRecording
              ? `rgba(139, 170, 173, ${0.4 + height * 0.6})`
              : `rgba(139, 170, 173, ${0.2 + height * 0.4})`,
            minHeight: "4px",
          }}
        />
      ))}
    </div>
  )
}

export default function Component() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [reflectionText, setReflectionText] = useState("")
  const [showWeeklyHighlights, setShowWeeklyHighlights] = useState(false)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)

  const affirmations = [
    "You are doing sacred work.",
    "Every act of care matters.",
    "Your presence is a gift.",
    "Compassion flows through you.",
    "You bring light to difficult moments.",
  ]

  // Rotate affirmations every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % affirmations.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Show weekly highlights after 3 seconds on home screen
  useEffect(() => {
    if (currentScreen === "home") {
      const timer = setTimeout(() => {
        setShowWeeklyHighlights(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  // Sample sessions data with color coding
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const dayBefore = new Date(today)
  dayBefore.setDate(dayBefore.getDate() - 2)

  const sessionsByDay = [
    {
      date: "Today",
      fullDate: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      sessions: [
        {
          id: 1,
          type: "Check-In",
          time: "2:30 PM",
          summary: "Good spirits today. Enjoyed afternoon tea together. 🫖",
          icon: "💬",
          color: "#E8F5E8", // sage
          borderColor: "#B8D4B8",
        },
        {
          id: 2,
          type: "Medication",
          time: "9:00 AM",
          summary: "Morning pills taken. No resistance today. ✨",
          icon: "💊",
          color: "#F0E6FF", // lavender
          borderColor: "#D4C5F9",
        },
      ],
    },
    {
      date: "Yesterday",
      fullDate: yesterday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      sessions: [
        {
          id: 3,
          type: "Sundowning",
          time: "6:45 PM",
          summary: "Brief disorientation. Calmed with familiar music. 🎵",
          icon: "🌅",
          color: "#FFE8D6", // peach
          borderColor: "#FFD4B3",
        },
        {
          id: 4,
          type: "Meal Support",
          time: "12:30 PM",
          summary: "Lunch went well. Ate most of the sandwich. 🥪",
          icon: "🍽️",
          color: "#FFF4E6", // warm cream
          borderColor: "#FFE4B3",
        },
        {
          id: 5,
          type: "Check-In",
          time: "10:15 AM",
          summary: "Quiet morning. Looked through photo albums. 📸",
          icon: "💬",
          color: "#E8F5E8",
          borderColor: "#B8D4B8",
        },
      ],
    },
    {
      date: dayBefore.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      fullDate: dayBefore.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      sessions: [
        {
          id: 6,
          type: "Evening Routine",
          time: "8:00 PM",
          summary: "Bedtime routine smooth. Fell asleep quickly. 😴",
          icon: "🌙",
          color: "#E6F3FF", // soft blue
          borderColor: "#B3D9FF",
        },
        {
          id: 7,
          type: "Wellness Check",
          time: "3:00 PM",
          summary: "Vitals good. Mood seems brighter today. 💖",
          icon: "💗",
          color: "#FFE6F0", // soft pink
          borderColor: "#FFB3D9",
        },
        {
          id: 8,
          type: "Medication",
          time: "9:00 AM",
          summary: "Pills given. Patient calm and cooperative. 🕊️",
          icon: "💊",
          color: "#F0E6FF",
          borderColor: "#D4C5F9",
        },
      ],
    },
  ]

  const sessionTypes = [
    {
      id: "medication",
      label: "Medication",
      emoji: "💊",
      icon: Pill,
      description: "Track medication times and responses",
      color: "#F0E6FF",
      selectedColor: "#D4C5F9",
    },
    {
      id: "sundowning",
      label: "Sundowning",
      emoji: "🌅",
      icon: Sunset,
      description: "Document evening confusion or agitation",
      color: "#FFE8D6",
      selectedColor: "#FFD4B3",
    },
    {
      id: "freeform",
      label: "Freeform",
      emoji: "💬",
      icon: FileText,
      description: "Open conversation or general check-in",
      color: "#E8F5E8",
      selectedColor: "#B8D4B8",
    },
  ]

  const sessionData = {
    type: "Medication",
    duration: "4 minutes",
    timestamp: "Today at 9:00 AM",
    mood: "Calm",
    moodColor: "#C9E4DE",
    keyEvents: [
      {
        time: "09:00",
        event: "Morning medications given",
        icon: Pill,
        details: "All three pills taken without resistance ✨",
      },
      {
        time: "09:02",
        event: "Asked about breakfast",
        icon: Coffee,
        details: "Showed interest in having oatmeal 🥣",
        repetition: 2,
      },
    ],
    aiSummary:
      "Today's medication session went beautifully. Mom took her morning pills without any hesitation and seemed alert and cooperative. She asked about breakfast a couple of times, which shows wonderful appetite awareness. Her tone remained calm throughout our interaction, and she even smiled when I mentioned her favorite oatmeal. 💝",
    tags: ["cooperative", "alert", "good appetite"],
  }

  // Navigation functions
  const startNewSession = () => {
    setCurrentScreen("session-type")
  }

  const handleTypeSelect = (type: string) => {
    setSelectedSessionType(type as SessionType)
    setTimeout(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentScreen("session-confirm")
        setIsAnimating(false)
      }, 300)
    }, 100)
  }

  const handleBack = () => {
    if (currentScreen === "session-confirm") {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentScreen("session-type")
        setSelectedSessionType(null)
        setIsAnimating(false)
        setIsListening(false)
        setIsRecording(false)
      }, 300)
    } else if (currentScreen === "session-type") {
      setCurrentScreen("home")
    }
  }

  const handleStartSession = () => {
    setIsListening(true)
    setIsRecording(true)

    // Simulate recording for 3 seconds, then processing
    setTimeout(() => {
      setIsRecording(false)
      setTimeout(() => {
        setIsListening(false)
        setCurrentScreen("session-summary")
      }, 1000)
    }, 3000)
  }

  const handleSaveAndContinue = () => {
    setCurrentScreen("home")
    setSelectedSessionType(null)
    setReflectionText("")
  }

  // Start listening animation when entering confirm screen
  useEffect(() => {
    if (currentScreen === "session-confirm") {
      setTimeout(() => {
        setIsListening(true)
      }, 500)
    } else {
      setIsListening(false)
      setIsRecording(false)
    }
  }, [currentScreen])

  return (
    <TooltipProvider>
      <div className="min-h-screen" style={{ backgroundColor: "#FDFCF9" }}>
        {/* Weekly Highlights Modal */}
        {showWeeklyHighlights && currentScreen === "home" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <Card className="w-full max-w-md border-0 shadow-2xl" style={{ backgroundColor: "#FFFFFF" }}>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-light text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    This Week's Highlights
                  </h2>
                </div>

                <div className="space-y-4 mb-6 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">You recorded 4 sessions this week</p>
                      <p className="text-xs text-gray-600">3 had calm tone, 1 showed increased repetition</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm">💝</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">You responded with patience every time</p>
                      <p className="text-xs text-gray-600">Your care makes all the difference</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowWeeklyHighlights(false)}
                  className="w-full rounded-full"
                  style={{ backgroundColor: "#8BAAAD", color: "white" }}
                >
                  Continue Your Journey
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWeeklyHighlights(false)}
                  className="absolute top-4 right-4 p-2 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Home Screen */}
        {currentScreen === "home" && (
          <div className="min-h-screen pb-32">
            <div className="flex">
              {/* Left Timeline Section - Journal Style */}
              <div className="w-full max-w-4xl pl-8 pr-4 py-12 relative">
                {/* Header */}
                <div className="mb-12 pl-16">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1
                        className="text-4xl font-light text-gray-800 mb-2 tracking-tight"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        Carelink
                      </h1>
                      <p className="text-gray-500 text-lg font-light">Your care journey, documented with love</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className="mb-2 px-3 py-1 text-xs font-medium border-0"
                        style={{ backgroundColor: "#E8F5E8", color: "#2D5016" }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Overall Calm This Week
                      </Badge>
                      <p className="text-sm text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                      <p className="text-2xl font-light text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Vertical Timeline Line */}
                <div className="absolute left-12 top-32 bottom-0 w-px" style={{ backgroundColor: "#E6E6E6" }} />

                {/* Timeline */}
                <div className="space-y-12 relative">
                  {sessionsByDay.map((day, dayIndex) => (
                    <div key={day.date} className="space-y-6">
                      {/* Day Header */}
                      <div className="sticky top-0 z-10 py-3 pl-16" style={{ backgroundColor: "#FDFCF9" }}>
                        <h2 className="text-2xl font-light text-gray-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                          {day.date}
                        </h2>
                        <p className="text-sm font-medium" style={{ color: "#8BAAAD" }}>
                          {day.fullDate}
                        </p>
                      </div>

                      {/* Sessions */}
                      <div className="space-y-6">
                        {day.sessions.map((session, sessionIndex) => (
                          <div key={session.id} className="relative flex items-start">
                            {/* Timeline Marker */}
                            <div className="absolute left-12 flex items-center justify-center">
                              <div
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm z-10"
                                style={{ backgroundColor: session.borderColor }}
                              />
                            </div>

                            {/* Session Card - Left Third Layout */}
                            <div className="ml-20 w-full max-w-2xl">
                              <Card
                                className="border-0 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg relative overflow-hidden"
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                }}
                              >
                                {/* Color-coded side strip */}
                                <div
                                  className="absolute left-0 top-0 bottom-0 w-1"
                                  style={{ backgroundColor: session.borderColor }}
                                />

                                <CardContent className="p-6 pl-8">
                                  <div className="flex items-start gap-4">
                                    {/* Emoji Icon */}
                                    <div className="flex-shrink-0 mt-1">
                                      <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                                        style={{ backgroundColor: session.color }}
                                      >
                                        {session.icon}
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-medium text-gray-800">{session.type}</h3>
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5" style={{ color: "#8BAAAD" }} />
                                          <span className="text-sm font-medium" style={{ color: "#8BAAAD" }}>
                                            {session.time}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-gray-600 leading-relaxed font-light text-base">
                                        {session.summary}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gentle encouragement */}
                <div className="text-center py-16 pl-16">
                  <p className="text-gray-400 font-light text-lg mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    Your care moments are safely stored here
                  </p>
                  <p className="text-gray-300 text-sm italic">{affirmations[currentAffirmation]}</p>
                </div>
              </div>

              {/* Right Space for Future Content */}
              <div className="hidden lg:block w-1/3 p-8">
                <div className="sticky top-8">
                  <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                    <p className="text-gray-400 text-sm text-center italic">
                      Space for insights, patterns, and reflections
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Floating Start Session Button */}
            <div className="fixed bottom-8 right-8">
              <Button
                size="lg"
                onClick={startNewSession}
                className="h-16 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 animate-pulse"
                style={{
                  backgroundColor: "#8BAAAD",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(139, 170, 173, 0.3)",
                }}
              >
                <Plus className="w-5 h-5 mr-3" />
                <span className="font-medium text-lg">Start a New Memory</span>
              </Button>
            </div>
          </div>
        )}

        {/* Session Type Selection */}
        {currentScreen === "session-type" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className={`w-full max-w-lg transition-all duration-300 ease-out ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <Card className="border-0 shadow-2xl" style={{ backgroundColor: "#FFFFFF" }}>
                <CardContent className="p-12 text-center">
                  {/* Back Button */}
                  <div className="flex justify-start mb-8">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                  </div>

                  {/* Header */}
                  <div className="mb-12">
                    <h1
                      className="text-3xl font-light text-gray-800 mb-4 leading-relaxed"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      What kind of memory shall we capture?
                    </h1>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                      Choose the type that feels right for this moment
                    </p>
                  </div>

                  {/* Session Type Options */}
                  <div className="space-y-4 mb-8">
                    {sessionTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant="ghost"
                        className="w-full h-24 p-6 rounded-3xl transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-lg border-2 border-transparent hover:border-opacity-20"
                        style={{
                          backgroundColor: type.color,
                          color: "#4A5568",
                          borderColor: type.selectedColor,
                        }}
                        onClick={() => handleTypeSelect(type.id)}
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-white/60 shadow-sm">
                              {type.emoji}
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-medium mb-1">{type.label}</h3>
                            <p className="text-sm text-gray-600 font-light">{type.description}</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Session Confirmation with Live Waveform */}
        {currentScreen === "session-confirm" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className={`w-full max-w-lg transition-all duration-300 ease-out ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <Card className="border-0 shadow-2xl" style={{ backgroundColor: "#FFFFFF" }}>
                <CardContent className="p-12 text-center">
                  {/* Back Button */}
                  <div className="flex justify-start mb-8">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                  </div>

                  {/* Header */}
                  <div className="mb-12">
                    <h1
                      className="text-3xl font-light text-gray-800 mb-4 leading-relaxed"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Ready to begin?
                    </h1>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                      I'll listen gently and help you capture this {selectedSessionType} moment
                    </p>
                  </div>

                  {/* Live Audio Waveform */}
                  <div className="mb-8">
                    <div
                      className="w-64 h-32 mx-auto rounded-3xl flex items-center justify-center transition-all duration-500 ease-out"
                      style={{
                        backgroundColor: "#F8F9FA",
                        boxShadow: isListening
                          ? "0 0 0 20px rgba(139, 170, 173, 0.05), 0 0 0 40px rgba(139, 170, 173, 0.02)"
                          : "0 8px 25px rgba(0,0,0,0.08)",
                      }}
                    >
                      <AudioWaveform isListening={isListening} isRecording={isRecording} />
                    </div>
                  </div>

                  {/* Dynamic Microcopy */}
                  <div className="mb-8">
                    <p className="text-gray-400 text-sm leading-relaxed italic">
                      {!isListening && "Getting ready to listen..."}
                      {isListening &&
                        !isRecording &&
                        "I'm listening—just speak naturally, I'll capture the important parts."}
                      {isRecording && "Recording your words with care..."}
                    </p>
                  </div>

                  {/* Selected Type Confirmation */}
                  <div className="mb-8">
                    <div
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-sm"
                      style={{
                        backgroundColor: sessionTypes.find((t) => t.id === selectedSessionType)?.selectedColor,
                      }}
                    >
                      <span className="text-2xl">{sessionTypes.find((t) => t.id === selectedSessionType)?.emoji}</span>
                      <span className="text-gray-700 font-medium">
                        {sessionTypes.find((t) => t.id === selectedSessionType)?.label} Memory
                      </span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <Button
                    size="lg"
                    onClick={handleStartSession}
                    disabled={isRecording}
                    className="w-full h-16 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{
                      backgroundColor: isRecording ? "#8BAAAD" : "#546A7B",
                      color: "white",
                    }}
                  >
                    {isRecording ? "Recording..." : "Begin Listening"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Session Summary */}
        {currentScreen === "session-summary" && (
          <div className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-light text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                      Memory captured. Let's look at what matters. ✨
                    </h1>
                    <p className="text-gray-500 font-light">
                      {sessionData.timestamp} • {sessionData.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Saved locally. This moment is yours, and only yours.</span>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <Card
                className="mb-8 border shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E8E6E3",
                }}
              >
                <CardContent className="p-8">
                  {/* Session Type & Mood */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
                        💊
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-gray-800">{sessionData.type} Memory</h2>
                        <p className="text-gray-500 text-sm">Lovingly summarized by AI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            className="px-3 py-1 text-sm font-medium border-0"
                            style={{
                              backgroundColor: sessionData.moodColor,
                              color: "#2D3748",
                            }}
                          >
                            <Sun className="w-3 h-3 mr-1" />
                            Tone: {sessionData.mood}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI detected emotional tone throughout the session</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-l-4 border-blue-200">
                      <p className="text-gray-700 leading-relaxed font-light text-lg">{sessionData.aiSummary}</p>
                    </div>
                  </div>

                  {/* Key Events Timeline */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Beautiful Moments</h3>
                    <div className="space-y-3">
                      {sessionData.keyEvents.map((event, index) => {
                        const IconComponent = event.icon
                        return (
                          <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-500">{event.time}</span>
                                {event.repetition && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        {event.repetition}x
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This topic came up {event.repetition} times</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              <p className="text-gray-800 font-medium mb-1">{event.event}</p>
                              <p className="text-gray-600 text-sm">{event.details}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-2">
                      {sessionData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-blue-50 text-blue-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Edit Options */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 px-3 py-1.5 h-auto rounded-full"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit Summary
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 px-3 py-1.5 h-auto rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      Add Tags
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reflection Prompt */}
              <Card
                className="border shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E8E6E3",
                }}
              >
                <CardContent className="p-8">
                  <div className="mb-4">
                    <h3 className="text-xl font-light text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                      What helped today?
                    </h3>
                    <p className="text-gray-500 text-sm font-light">Take a breath. What made today feel okay?</p>
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder="Your thoughts and observations..."
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      className="min-h-32 resize-none border-0 bg-transparent text-gray-700 placeholder:text-gray-400 focus:ring-0 p-0 text-base leading-relaxed"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(transparent, transparent 1.5rem, #E8E6E3 1.5rem, #E8E6E3 calc(1.5rem + 1px))",
                        lineHeight: "1.5rem",
                        paddingTop: "0.75rem",
                      }}
                    />
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-200">
                    <p className="text-gray-600 text-sm italic text-center" style={{ fontFamily: "Georgia, serif" }}>
                      "You just captured something meaningful. Every moment of care creates ripples of love."
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-center mt-8">
                <Button
                  size="lg"
                  onClick={handleSaveAndContinue}
                  className="px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    backgroundColor: "#546A7B",
                    color: "white",
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Continue Your Journey
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
