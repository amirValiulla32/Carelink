"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  Heart, Shield, Users, BookOpen, Mic, TrendingUp, Check, ArrowRight,
  Lock, Clock, FileText, Play, Star, CheckCircle2, X, Zap, BarChart3,
  FileCheck, MessageSquare, Bell, Settings, ChevronRight, Sparkles,
  Building2, Stethoscope, ClipboardList, Calendar
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SiteHeader } from "@/components/site-header"
import { ProductMockup } from "@/components/product-mockup"
import { AnimatedCounter } from "@/components/animated-counter"

const highlights = [
  {
    label: "96%",
    description: "of caregivers reported calmer evenings after two weeks.",
    icon: Heart,
    color: "text-emerald-600",
  },
  {
    label: "12hr",
    description: "average time saved each month on manual note keeping.",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    label: "180K",
    description: "moments captured and searchable across Carelink teams.",
    icon: FileText,
    color: "text-violet-600",
  },
]

const howItWorksSteps = [
  {
    step: "01",
    title: "Capture moments naturally",
    description: "Write quick notes or record audio reflections. Our guided prompts feel conversational, not clinical.",
    icon: Mic,
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: "02",
    title: "AI organizes automatically",
    description: "Local AI processes your notes, identifying patterns in mood, medication, and daily routines.",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "03",
    title: "Share insights securely",
    description: "Generate summaries for family or clinicians. Control exactly what's shared, and with whom.",
    icon: Shield,
    color: "from-violet-500 to-purple-500",
  },
  {
    step: "04",
    title: "Stay ahead of changes",
    description: "Spot subtle shifts before they become crises. Make informed decisions backed by real data.",
    icon: TrendingUp,
    color: "from-pink-500 to-rose-500",
  },
]

const bentoFeatures = [
  {
    title: "Smart journaling",
    description: "AI-guided prompts that adapt to your loved one's unique care needs",
    icon: BookOpen,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-600",
    size: "large",
  },
  {
    title: "Voice capture",
    description: "Record and transcribe observations hands-free",
    icon: Mic,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-600",
    size: "small",
  },
  {
    title: "Trend analysis",
    description: "Visual timelines of medication, mood, and behaviors",
    icon: BarChart3,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-600",
    size: "small",
  },
  {
    title: "Team collaboration",
    description: "Invite family, aides, and clinicians to shared care records",
    icon: Users,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-600",
    size: "medium",
  },
  {
    title: "Smart reminders",
    description: "Never miss medication or appointment times",
    icon: Bell,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-600",
    size: "small",
  },
  {
    title: "Export reports",
    description: "Generate professional summaries for medical visits",
    icon: FileCheck,
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-600",
    size: "small",
  },
]

const caseStudies = [
  {
    quote: "Within three weeks, Carelink helped us identify a pattern: Dad became agitated every Tuesday evening. Turns out, it was medication timing. We adjusted the schedule, and nights became peaceful again.",
    name: "Olivia Martin",
    role: "Daughter & Care Coordinator",
    avatar: "OM",
    metrics: [
      { label: "Reduced agitation incidents", value: "73%" },
      { label: "Better sleep quality", value: "5 nights/week" },
    ],
    company: "Family Caregiver, Portland",
  },
  {
    quote: "The weekly briefings transformed our facility. Staff arrive informed about each resident's week—no more scattered notes or lost context. Carelink became our care team's shared brain.",
    name: "Samuel Turner",
    role: "Director of Care",
    avatar: "ST",
    metrics: [
      { label: "Staff onboarding time", value: "40% faster" },
      { label: "Family satisfaction score", value: "4.8/5.0" },
    ],
    company: "GreenBridge Memory Care",
  },
]

const comparisonRows = [
  { feature: "Daily observation capture", carelink: true, traditional: "partial" },
  { feature: "Audio transcription", carelink: true, traditional: false },
  { feature: "Pattern detection & insights", carelink: true, traditional: false },
  { feature: "Team collaboration tools", carelink: true, traditional: "limited" },
  { feature: "HIPAA-compliant security", carelink: true, traditional: true },
  { feature: "Offline-first privacy", carelink: true, traditional: false },
  { feature: "Exportable medical reports", carelink: true, traditional: "limited" },
  { feature: "Learning curve", carelink: "Minutes", traditional: "Hours" },
]

const customerLogos = [
  { name: "Memory Care Alliance", type: "Organization" },
  { name: "Family Caregivers Network", type: "Community" },
  { name: "Senior Living Partners", type: "Facility" },
  { name: "Healthcare Innovation Lab", type: "Institute" },
]

const trustSignals = [
  "HIPAA Compliant",
  "SOC 2 Type II",
  "End-to-End Encrypted",
  "ISO 27001 Certified",
]

const faqs = [
  {
    question: "Is my data ever shared outside of Carelink?",
    answer:
      "No. Transcription and analysis run locally, and data stays encrypted on your device unless you explicitly export it.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "Carelink runs in the browser. We provide optional desktop companions for clinics that prefer dedicated workstations.",
  },
  {
    question: "Can multiple caregivers collaborate?",
    answer:
      "Yes. Invite trusted collaborators with role-based permissions so everyone stays aligned without overwhelming notifications.",
  },
]

export default function Page() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <SiteHeader />

      <main>
        {/* Hero Section with Product Demo */}
        <section ref={heroRef} className="relative overflow-hidden border-b border-slate-200/50">
          {/* Animated Background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-blue-50/40 to-violet-50/50" />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute right-1/4 top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 md:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl text-center"
            >
              <Badge className="mb-6 rounded-full border-emerald-200 bg-emerald-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
                <Heart className="mr-2 inline-block h-3 w-3" />
                Care that remembers
              </Badge>

              <h1 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-5xl font-bold leading-[1.05] text-transparent md:text-7xl">
                The operating system for
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  compassionate caregiving
                </span>
              </h1>

              <p className="mt-8 text-lg leading-relaxed text-slate-600 md:text-xl">
                Capture moments, detect patterns, and stay ahead of changing needs—all while protecting privacy and dignity.
                Trusted by families and memory care facilities nationwide.
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="group h-14 bg-emerald-600 px-8 text-base shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/40">
                  <Link href="/signup">
                    Start free trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="group h-14 border-2 border-slate-300 bg-white px-8 text-base text-slate-900 shadow-sm transition-all hover:border-emerald-600 hover:bg-emerald-50/50">
                  <Link href="/login">
                    <Play className="mr-2 h-4 w-4" />
                    Watch demo
                  </Link>
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                {trustSignals.map((signal) => (
                  <div key={signal} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">{signal}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 md:mt-24"
            >
              <ProductMockup variant="browser">
                <div className="relative h-[500px] bg-gradient-to-br from-slate-50 to-white">
                  {/* Simulated App Interface */}
                  <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-slate-200 bg-slate-50 p-4">
                      <div className="mb-6 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-xs font-bold text-white">
                          CL
                        </div>
                        <span className="font-semibold text-slate-900">Carelink</span>
                      </div>
                      <nav className="space-y-1">
                        {[
                          { icon: FileText, label: "Journal", active: true },
                          { icon: BarChart3, label: "Insights" },
                          { icon: Calendar, label: "Schedule" },
                          { icon: Users, label: "Care Team" },
                          { icon: Settings, label: "Settings" },
                        ].map((item) => {
                          const Icon = item.icon
                          return (
                            <div
                              key={item.label}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                                item.active
                                  ? "bg-emerald-100 text-emerald-900 font-medium"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                            </div>
                          )
                        })}
                      </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Today's Journal</h2>
                        <p className="text-sm text-slate-500">Thursday, January 16, 2025</p>
                      </div>

                      {/* Journal Entries */}
                      <div className="space-y-4">
                        {[
                          { time: "9:30 AM", text: "Morning routine went smoothly. Mom enjoyed breakfast.", mood: "positive" },
                          { time: "2:15 PM", text: "Afternoon walk in the garden. She remembered the roses.", mood: "positive" },
                          { time: "6:45 PM", text: "Some confusion about dinner time. Redirected gently.", mood: "neutral" },
                        ].map((entry, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="rounded-lg border border-slate-200 bg-white p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-500">{entry.time}</span>
                              <Badge
                                variant="outline"
                                className={
                                  entry.mood === "positive"
                                    ? "border-emerald-300 text-emerald-700"
                                    : "border-slate-300 text-slate-600"
                                }
                              >
                                {entry.mood}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700">{entry.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ProductMockup>
            </motion.div>

            {/* Stats Cards */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {highlights.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
                      <CardContent className="relative p-8">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
                          <Icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <p className="text-5xl font-bold text-slate-900">
                          <AnimatedCounter value={item.label} />
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Customer Logos */}
        <section className="border-b border-slate-200/50 bg-white py-12">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-slate-500">
              Trusted by leading care organizations
            </p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {customerLogos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-slate-100 p-4">
                      <Building2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-700">{logo.name}</p>
                    <p className="text-xs text-slate-500">{logo.type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section ref={howItWorksRef} className="border-b border-slate-200/50 bg-gradient-to-b from-slate-50 to-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              className="mb-16 max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                HOW IT WORKS
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                From observation to insight in four simple steps
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Carelink transforms scattered notes into actionable intelligence, all while keeping your data private and secure.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-xl">
                      {/* Step Number */}
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-5xl font-bold text-slate-200">{step.step}</span>
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                      </div>

                      <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                      <p className="leading-relaxed text-slate-600">{step.description}</p>

                      {/* Connector Line */}
                      {index < howItWorksSteps.length - 1 && (
                        <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-gradient-to-r from-slate-300 to-transparent lg:block" />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section ref={featuresRef} id="features" className="border-b border-slate-200/50 bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              className="mb-16 max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                PLATFORM CAPABILITIES
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Everything you need in one elegant workspace
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                From daily observations to long-term insights, Carelink adapts to your caregiving journey.
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-3">
              {bentoFeatures.map((feature, index) => {
                const Icon = feature.icon
                const colSpan = feature.size === "large" ? "md:col-span-2" : feature.size === "medium" ? "md:col-span-2 md:row-span-1" : "md:col-span-1"
                const rowSpan = feature.size === "large" ? "md:row-span-2" : ""

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-lg transition-all hover:border-slate-300 hover:shadow-xl ${colSpan} ${rowSpan}`}
                  >
                    <div className={`absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity group-hover:opacity-100`} />

                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                          <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                        </div>

                        <h3 className="mb-3 text-2xl font-bold text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600">{feature.description}</p>
                      </div>

                      <ChevronRight className="h-6 w-6 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Case Studies / Enhanced Testimonials */}
        <section id="stories" className="border-b border-slate-200/50 bg-gradient-to-b from-slate-50 to-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                SUCCESS STORIES
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Real families, measurable impact
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                See how Carelink transforms caregiving for families and facilities nationwide.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-10 shadow-xl transition-all hover:border-emerald-300 hover:shadow-2xl"
                >
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100/30 to-blue-100/30 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    {/* Quote */}
                    <div className="mb-6 text-5xl text-emerald-600/20">"</div>
                    <blockquote className="mb-8 text-lg leading-relaxed text-slate-700">
                      {study.quote}
                    </blockquote>

                    {/* Metrics */}
                    <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-6">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className="text-2xl font-bold text-emerald-700">{metric.value}</p>
                          <p className="text-xs text-slate-600">{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-emerald-200">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${study.avatar}`} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-200 font-semibold text-emerald-700">
                            {study.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900">{study.name}</p>
                          <p className="text-sm text-slate-600">{study.role}</p>
                          <p className="text-xs text-slate-500">{study.company}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="border-b border-slate-200/50 bg-white py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                COMPARISON
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Why caregivers choose Carelink
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Move beyond scattered notes and spreadsheets
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-xl"
            >
              <div className="grid grid-cols-3 border-b-2 border-slate-200 bg-slate-50 p-6 font-bold">
                <div className="text-slate-900">Feature</div>
                <div className="text-center text-emerald-700">Carelink</div>
                <div className="text-center text-slate-500">Traditional Methods</div>
              </div>

              {comparisonRows.map((row, index) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 items-center border-b border-slate-100 p-6 transition-colors hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-900">{row.feature}</div>
                  <div className="flex justify-center">
                    {row.carelink === true ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : row.carelink === "partial" || row.carelink === "limited" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                        <Check className="h-4 w-4 text-amber-600" />
                      </div>
                    ) : typeof row.carelink === "string" ? (
                      <span className="text-sm font-medium text-emerald-700">{row.carelink}</span>
                    ) : (
                      <X className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {row.traditional === true ? (
                      <CheckCircle2 className="h-6 w-6 text-slate-400" />
                    ) : row.traditional === "partial" || row.traditional === "limited" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                        <Check className="h-4 w-4 text-slate-400" />
                      </div>
                    ) : typeof row.traditional === "string" ? (
                      <span className="text-sm font-medium text-slate-500">{row.traditional}</span>
                    ) : (
                      <X className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-b border-slate-200/50 bg-gradient-to-b from-slate-50 to-white py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                FREQUENTLY ASKED
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Questions, answered with care
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      ?
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{faq.question}</h3>
                      <p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Demo CTA */}
        <section className="border-b border-slate-200/50 bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                GETTING STARTED
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Start protecting what matters most
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Join families and facilities transforming caregiving with Carelink
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Free Trial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-lg"
              >
                <div className="mb-4">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                    Individual
                  </Badge>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">Free Trial</h3>
                <p className="mb-6 text-slate-600">Perfect for families getting started</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {["Unlimited journal entries", "Audio transcription", "Basic insights", "1 care team member"].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/signup">Start free trial</Link>
                </Button>
              </motion.div>

              {/* Professional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="relative rounded-3xl border-4 border-emerald-500 bg-gradient-to-br from-white to-emerald-50/30 p-8 shadow-2xl"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                </div>
                <div className="mb-4">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                    Family
                  </Badge>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">Professional</h3>
                <p className="mb-6 text-slate-600">For families with complex care needs</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">$29</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {[
                    "Everything in Free",
                    "Advanced pattern detection",
                    "Unlimited care team",
                    "Export medical reports",
                    "Priority support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                  <Link href="/signup">Get started</Link>
                </Button>
              </motion.div>

              {/* Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-lg"
              >
                <div className="mb-4">
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    Facility
                  </Badge>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">Enterprise</h3>
                <p className="mb-6 text-slate-600">For memory care facilities</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">Custom</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {[
                    "Everything in Professional",
                    "Unlimited residents",
                    "Staff training & onboarding",
                    "Custom integrations",
                    "Dedicated account manager",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/signup">Request demo</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
              className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Begin the next chapter of care
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-emerald-50">
                Join caregivers who balance empathy with preparation. Craft a living record that supports every decision,
                every handoff, every conversation.
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="group h-14 border-2 border-white bg-white px-10 text-base text-emerald-700 shadow-2xl transition-all hover:bg-emerald-50">
                  <Link href="/signup">
                    Create my account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild className="h-14 border-2 border-white/30 px-10 text-base text-white transition-all hover:border-white/50 hover:bg-white/10">
                  <Link href="#features">Explore features</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg">
                  CL
                </div>
                Carelink
              </div>
              <p className="max-w-md leading-relaxed text-slate-600">
                The operating system for compassionate caregiving. Designed for families and facilities protecting what's timeless.
              </p>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="outline" className="border-slate-300 text-slate-600">
                  <Lock className="mr-1 h-3 w-3" />
                  HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="border-slate-300 text-slate-600">
                  <Shield className="mr-1 h-3 w-3" />
                  SOC 2 Type II
                </Badge>
                <Badge variant="outline" className="border-slate-300 text-slate-600">
                  <Zap className="mr-1 h-3 w-3" />
                  ISO 27001
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Product</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  { label: "Features", href: "#features" },
                  { label: "How it works", href: "#how-it-works" },
                  { label: "Success stories", href: "#stories" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="transition-colors hover:text-emerald-600">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Company</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="/login" className="transition-colors hover:text-emerald-600">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="transition-colors hover:text-emerald-600">
                    Create account
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@carelink.app" className="transition-colors hover:text-emerald-600">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-emerald-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-emerald-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Carelink Collective. All rights reserved. Built with care for those who care.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
