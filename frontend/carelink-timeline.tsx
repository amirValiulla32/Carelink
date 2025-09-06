"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pill, Brain, Heart, Coffee, Moon, MessageCircle, Clock } from "lucide-react"

export default function Component() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

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
          summary: "Good spirits today. Enjoyed afternoon tea together.",
          icon: MessageCircle,
        },
        {
          id: 2,
          type: "Medication",
          time: "9:00 AM",
          summary: "Morning pills taken. No resistance today.",
          icon: Pill,
        },
      ],
    },
    {
      date: "Yesterday",
      fullDate: yesterday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      sessions: [
        {
          id: 3,
          type: "Confusion",
          time: "6:45 PM",
          summary: "Brief disorientation. Calmed with familiar music.",
          icon: Brain,
        },
        {
          id: 4,
          type: "Meal Support",
          time: "12:30 PM",
          summary: "Lunch went well. Ate most of the sandwich.",
          icon: Coffee,
        },
        {
          id: 5,
          type: "Check-In",
          time: "10:15 AM",
          summary: "Quiet morning. Looked through photo albums.",
          icon: MessageCircle,
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
          summary: "Bedtime routine smooth. Fell asleep quickly.",
          icon: Moon,
        },
        {
          id: 7,
          type: "Wellness Check",
          time: "3:00 PM",
          summary: "Vitals good. Mood seems brighter today.",
          icon: Heart,
        },
        {
          id: 8,
          type: "Medication",
          time: "9:00 AM",
          summary: "Pills given. Patient calm and cooperative.",
          icon: Pill,
        },
      ],
    },
  ]

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Medication":
        return "text-blue-600"
      case "Confusion":
        return "text-purple-600"
      case "Check-In":
        return "text-green-600"
      case "Meal Support":
        return "text-amber-600"
      case "Evening Routine":
        return "text-indigo-600"
      case "Wellness Check":
        return "text-pink-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: "#F8F8F6" }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-2 tracking-tight">Carelink</h1>
          <p className="text-gray-500 text-lg font-light">Your care journey, documented with love</p>
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          {sessionsByDay.map((day) => (
            <div key={day.date} className="space-y-4">
              {/* Day Header */}
              <div className="sticky top-0 z-10 py-3" style={{ backgroundColor: "#F8F8F6" }}>
                <h2 className="text-2xl font-light text-gray-800 mb-1">{day.date}</h2>
                <p className="text-sm font-medium" style={{ color: "#8BAAAD" }}>
                  {day.fullDate}
                </p>
              </div>

              {/* Sessions */}
              <div className="space-y-3">
                {day.sessions.map((session) => {
                  const IconComponent = session.icon
                  return (
                    <Card
                      key={session.id}
                      className="border-0 cursor-pointer transition-all duration-200 ease-out"
                      style={{
                        backgroundColor: "#FFFFFF",
                        boxShadow:
                          hoveredCard === session.id
                            ? "0 8px 25px rgba(224, 224, 224, 0.4)"
                            : "0 2px 8px rgba(224, 224, 224, 0.3)",
                        transform: hoveredCard === session.id ? "scale(1.01)" : "scale(1)",
                      }}
                      onMouseEnter={() => setHoveredCard(session.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "#F8F8F6" }}
                            >
                              <IconComponent className={`w-5 h-5 ${getSessionTypeColor(session.type)}`} />
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
                            <p className="text-gray-600 leading-relaxed font-light">{session.summary}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state message */}
        <div className="text-center py-16">
          <p className="text-gray-400 font-light text-lg">Your care moments are safely stored here</p>
        </div>
      </div>

      {/* Floating Start Session Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          size="lg"
          className="h-14 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#8BAAAD",
            color: "white",
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium">Start Session</span>
        </Button>
      </div>
    </div>
  )
}
