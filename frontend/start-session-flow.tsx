"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pill, Sunset, FileText, Mic, ArrowLeft, Check } from "lucide-react"

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [micPulse, setMicPulse] = useState(false)

  const sessionTypes = [
    {
      id: "medication",
      label: "Medication",
      emoji: "💊",
      icon: Pill,
      description: "Track medication times and responses",
    },
    {
      id: "sundowning",
      label: "Sundowning",
      emoji: "🌅",
      icon: Sunset,
      description: "Document evening confusion or agitation",
    },
    {
      id: "freeform",
      label: "Freeform",
      emoji: "📝",
      icon: FileText,
      description: "Open conversation or general check-in",
    },
  ]

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setTimeout(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(2)
        setIsAnimating(false)
      }, 300)
    }, 100)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(1)
      setSelectedType(null)
      setIsAnimating(false)
    }, 300)
  }

  const handleStartSession = () => {
    // Simulate starting session
    console.log("Starting session:", selectedType)
  }

  // Mic pulse animation
  useEffect(() => {
    if (currentStep === 2) {
      const interval = setInterval(() => {
        setMicPulse(true)
        setTimeout(() => setMicPulse(false), 1000)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [currentStep])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: "#FAFAF8" }}>
      <div
        className={`w-full max-w-lg transition-all duration-300 ease-out ${
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {currentStep === 1 && (
          <Card className="border-0 shadow-xl" style={{ backgroundColor: "#FFFFFF" }}>
            <CardContent className="p-12 text-center">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-3xl font-light text-gray-800 mb-4 leading-relaxed">What kind of session?</h1>
                <p className="text-gray-500 text-lg font-light leading-relaxed">
                  Choose the type that feels right for this moment
                </p>
              </div>

              {/* Session Type Options */}
              <div className="space-y-4 mb-8">
                {sessionTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant="ghost"
                      className={`w-full h-20 p-6 rounded-2xl transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                        selectedType === type.id ? "shadow-lg" : "shadow-sm hover:shadow-md"
                      }`}
                      style={{
                        backgroundColor: selectedType === type.id ? "#B2C8BA" : "#E9ECEF",
                        color: selectedType === type.id ? "#FFFFFF" : "#4A5568",
                      }}
                      onClick={() => handleTypeSelect(type.id)}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex-shrink-0">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor:
                                selectedType === type.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
                            }}
                          >
                            <span className="text-2xl">{type.emoji}</span>
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-medium mb-1">{type.label}</h3>
                          <p className={`text-sm ${selectedType === type.id ? "text-white/80" : "text-gray-500"}`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="border-0 shadow-xl" style={{ backgroundColor: "#FFFFFF" }}>
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
                <h1 className="text-3xl font-light text-gray-800 mb-4 leading-relaxed">Ready to begin?</h1>
                <p className="text-gray-500 text-lg font-light leading-relaxed">
                  I'll listen and help you document this {selectedType} session
                </p>
              </div>

              {/* Mic Animation */}
              <div className="mb-12">
                <div
                  className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-1000 ease-out ${
                    micPulse ? "scale-110" : "scale-100"
                  }`}
                  style={{
                    backgroundColor: "#F8F9FA",
                    boxShadow: micPulse
                      ? "0 0 0 20px rgba(178, 200, 186, 0.1), 0 0 0 40px rgba(178, 200, 186, 0.05)"
                      : "0 8px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  <Mic
                    className={`w-12 h-12 transition-colors duration-300 ${
                      micPulse ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>

              {/* Selected Type Confirmation */}
              <div className="mb-8">
                <div
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                  style={{ backgroundColor: "#B2C8BA" }}
                >
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">
                    {sessionTypes.find((t) => t.id === selectedType)?.label} Session
                  </span>
                </div>
              </div>

              {/* Start Button */}
              <Button
                size="lg"
                onClick={handleStartSession}
                className="w-full h-16 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "#546A7B",
                  color: "white",
                }}
              >
                Start Listening
              </Button>

              <p className="text-gray-400 text-sm mt-6 leading-relaxed">
                Speak naturally—I'll capture the important moments
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
