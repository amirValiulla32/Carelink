import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileAudio, Video, Activity, ClipboardCheck, Search } from "lucide-react"

const reviewQueue = [
  {
    id: 1,
    patient: "Case 18-041",
    label: "Speech Sample",
    time: "9:12 AM",
    note: "Mild dysarthria noted during sentence repetition.",
    icon: FileAudio,
    status: "new",
  },
  {
    id: 2,
    patient: "Case 22-117",
    label: "Motor Check-in",
    time: "10:05 AM",
    note: "Finger-tap cadence slowed vs. last week (−12%).",
    icon: Video,
    status: "priority",
  },
  {
    id: 3,
    patient: "Case 19-302",
    label: "Medication Response",
    time: "11:40 AM",
    note: "Patient reports reduced tremor post-dose; stiffness persists.",
    icon: ClipboardCheck,
    status: "new",
  },
]

const timelineFindings = [
  {
    id: 1,
    label: "Motor variability",
    summary: "Afternoon bradykinesia trends upward over 4 recordings.",
    icon: Activity,
  },
  {
    id: 2,
    label: "Cognitive markers",
    summary: "Word-finding pauses increased in last 2 speech samples.",
    icon: Search,
  },
]

export default function RemoteMonitoringReviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-light text-slate-800 mb-2">Review Patient Interactions</h1>
            <p className="text-slate-500 text-lg font-light">
              Prioritize recordings, annotate symptoms, and confirm longitudinal changes.
            </p>
          </div>
          <Button className="h-11 rounded-full px-6" variant="secondary">
            Export Review Brief
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-medium text-slate-800">Review Queue</h2>
                  <p className="text-slate-500 text-sm">3 recordings awaiting clinical review.</p>
                </div>
                <Button variant="outline" className="rounded-full">
                  Filter Cases
                </Button>
              </div>

              <div className="space-y-4">
                {reviewQueue.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-slate-500">{item.patient}</p>
                            <h3 className="text-lg font-medium text-slate-800">{item.label}</h3>
                          </div>
                          <Badge
                            className={`${
                              item.status === "priority"
                                ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            } rounded-full border-0`}
                          >
                            {item.status === "priority" ? "Priority" : "New"}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mt-2">{item.note}</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4" />
                          <span>Recorded {item.time}</span>
                        </div>
                      </div>
                      <Button className="self-center rounded-full">Open</Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium text-slate-800 mb-4">Patient Snapshot</h2>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Active cases</span>
                    <span className="text-slate-800 font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reviewed this week</span>
                    <span className="text-slate-800 font-medium">27</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Escalations pending</span>
                    <span className="text-rose-600 font-medium">2</span>
                  </div>
                </div>
                <Button className="mt-5 w-full rounded-full" variant="secondary">
                  View Case Load
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium text-slate-800 mb-4">Trend Findings</h2>
                <div className="space-y-4">
                  {timelineFindings.map((finding) => {
                    const Icon = finding.icon
                    return (
                      <div key={finding.id} className="flex gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{finding.label}</p>
                          <p className="text-sm text-slate-600">{finding.summary}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button className="mt-5 w-full rounded-full">Open Trends Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
