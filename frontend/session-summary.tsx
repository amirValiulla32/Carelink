"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Pill, RotateCcw, Heart, Edit3, Tag, Check, Shield, Sun, Coffee } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Component() {
  const [reflectionText, setReflectionText] = useState("")
  const [showEditOptions, setShowEditOptions] = useState(false)

  const sessionData = {
    type: "Medication",
    duration: "4 minutes",
    timestamp: `Today at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
    mood: "Calm",
    moodColor: "#C9E4DE",
    keyEvents: [
      {
        time: "09:00",
        event: "Morning medications given",
        icon: Pill,
        details: "All three pills taken without resistance",
      },
      {
        time: "09:02",
        event: "Asked about breakfast",
        icon: Coffee,
        details: "Showed interest in having oatmeal",
        repetition: 2,
      },
    ],
    aiSummary:
      "Today's medication session went smoothly. Mom took her morning pills without any hesitation and seemed alert and cooperative. She asked about breakfast a couple of times, which shows good appetite awareness. Her tone remained calm throughout our interaction, and she even smiled when I mentioned her favorite oatmeal.",
    tags: ["cooperative", "alert", "good appetite"],
  }

  const reflectionPrompts = [
    "What helped today?",
    "What made this moment special?",
    "How are you feeling about this interaction?",
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen p-8" style={{ backgroundColor: "#FDFCF9" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-light text-gray-800 mb-2">Session Complete</h1>
                <p className="text-gray-500 font-light">
                  {sessionData.timestamp} • {sessionData.duration}
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Saved locally</span>
                <Check className="w-4 h-4" />
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
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-800">{sessionData.type} Session</h2>
                    <p className="text-gray-500 text-sm">AI Summary Generated</p>
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
                <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-200">
                  <p className="text-gray-700 leading-relaxed font-light text-lg">{sessionData.aiSummary}</p>
                </div>
              </div>

              {/* Key Events Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Key Moments</h3>
                <div className="space-y-3">
                  {sessionData.keyEvents.map((event, index) => {
                    const IconComponent = event.icon
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <IconComponent className="w-4 h-4 text-gray-600" />
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
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700">
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
                  onClick={() => setShowEditOptions(!showEditOptions)}
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
                <p className="text-gray-500 text-sm font-light">Take a moment to reflect on this interaction</p>
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

              {reflectionText.length === 0 && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">Need inspiration?</p>
                  <div className="flex flex-wrap gap-2">
                    {reflectionPrompts.slice(1).map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setReflectionText(prompt + " ")}
                        className="text-gray-500 hover:text-gray-700 px-3 py-1.5 h-auto rounded-full text-sm"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              className="px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              style={{
                backgroundColor: "#546A7B",
                color: "white",
              }}
            >
              <Heart className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
