import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Pill, Brain, Coffee, Moon, Plus } from "lucide-react"

export default function Component() {
  const sessions = [
    {
      id: 1,
      type: "Speech Sample",
      time: "9:00 AM",
      description: "Patient narrated morning routine for articulation review",
      icon: Heart,
      color: "bg-emerald-50 text-emerald-600",
      status: "reviewed",
    },
    {
      id: 2,
      type: "Medication Response Log",
      time: "11:30 AM",
      description: "Audio note captured 45 minutes after dose; tremor reduced",
      icon: Pill,
      color: "bg-blue-50 text-blue-600",
      status: "reviewed",
    },
    {
      id: 3,
      type: "Motor Check-in",
      time: "12:45 PM",
      description: "Timed finger tap video uploaded for bradykinesia tracking",
      icon: Coffee,
      color: "bg-amber-50 text-amber-600",
      status: "reviewed",
    },
    {
      id: 4,
      type: "Cognitive Drift Alert",
      time: "6:45 PM",
      description: "Patient report flagged for word-finding difficulty",
      icon: Brain,
      color: "bg-rose-50 text-rose-600",
      status: "flagged",
    },
    {
      id: 5,
      type: "Sleep Quality Check",
      time: "8:30 PM",
      description: "Evening reflection mentions vivid dreams and restlessness",
      icon: Moon,
      color: "bg-indigo-50 text-indigo-600",
      status: "reviewed",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-slate-800 mb-2">Carelink Neurology</h1>
              <p className="text-slate-500 text-lg font-light">Patient Interaction Review Console</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p className="text-2xl font-light text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Start Session Button */}
          <Button
            asChild
            size="lg"
            className="w-full h-16 text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/remote-monitoring/review">
              <Plus className="w-6 h-6 mr-3" />
              Review Patient Interactions
            </Link>
          </Button>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>

          <div className="space-y-6">
            {sessions.map((session, index) => {
              const IconComponent = session.icon
              return (
                <div key={session.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl ${session.color} flex items-center justify-center shadow-sm`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Session card */}
                  <Card className="flex-1 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-medium text-slate-800 mb-1">{session.type}</h3>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{session.time}</span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            session.status === "flagged"
                              ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          } rounded-full px-3 py-1 text-xs font-medium border-0`}
                        >
                          {session.status === "flagged" ? "Needs Review" : "Reviewed"}
                        </Badge>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{session.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mt-12 border-0 shadow-sm rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-medium text-slate-800 mb-2">Symptom Timeline Summary</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              5 patient recordings ingested for longitudinal symptom tracking
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-light text-blue-600 mb-1">5</div>
                <div className="text-slate-500">Recordings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-green-600 mb-1">4</div>
                <div className="text-slate-500">Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-rose-600 mb-1">1</div>
                <div className="text-slate-500">Needs Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
