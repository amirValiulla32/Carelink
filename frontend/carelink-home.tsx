import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Pill, Brain, Coffee, Moon, Plus } from "lucide-react"

export default function Component() {
  const sessions = [
    {
      id: 1,
      type: "Medication",
      time: "9:00 AM",
      description: "Morning medications administered",
      icon: Pill,
      color: "bg-blue-50 text-blue-600",
      status: "completed",
    },
    {
      id: 2,
      type: "Wellness Check",
      time: "11:30 AM",
      description: "Vital signs and mood assessment",
      icon: Heart,
      color: "bg-green-50 text-green-600",
      status: "completed",
    },
    {
      id: 3,
      type: "Meal Support",
      time: "12:45 PM",
      description: "Lunch assistance and hydration",
      icon: Coffee,
      color: "bg-amber-50 text-amber-600",
      status: "completed",
    },
    {
      id: 4,
      type: "Confusion Episode",
      time: "6:45 PM",
      description: "Brief disorientation, resolved with comfort",
      icon: Brain,
      color: "bg-purple-50 text-purple-600",
      status: "noted",
    },
    {
      id: 5,
      type: "Evening Routine",
      time: "8:30 PM",
      description: "Bedtime preparation and medications",
      icon: Moon,
      color: "bg-indigo-50 text-indigo-600",
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-slate-800 mb-2">Carelink</h1>
              <p className="text-slate-500 text-lg font-light">Today's Care Journey</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 font-medium">Thursday</p>
              <p className="text-2xl font-light text-slate-700">March 14</p>
            </div>
          </div>

          {/* Start Session Button */}
          <Button
            size="lg"
            className="w-full h-16 text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-6 h-6 mr-3" />
            Start New Session
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
                            session.status === "completed"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          } rounded-full px-3 py-1 text-xs font-medium border-0`}
                        >
                          {session.status === "completed" ? "Completed" : "Noted"}
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
            <h3 className="text-xl font-medium text-slate-800 mb-2">Today's Summary</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              5 sessions completed with attentive care and documentation
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-light text-blue-600 mb-1">5</div>
                <div className="text-slate-500">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-green-600 mb-1">4</div>
                <div className="text-slate-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-amber-600 mb-1">1</div>
                <div className="text-slate-500">Noted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
