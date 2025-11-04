import Link from "next/link"
import { Heart, Shield, Users, BookOpen, Mic, TrendingUp, Check, ArrowRight, Lock, Clock, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SiteHeader } from "@/components/site-header"

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

const features = [
  {
    title: "Soft-guided journaling",
    description:
      "Capture daily observations with structured prompts that feel like a conversation, not homework.",
    icon: BookOpen,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
  },
  {
    title: "Private audio reflections",
    description:
      "Record and transcribe key moments locally. All processing stays on your device for complete peace of mind.",
    icon: Mic,
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Long-view insights",
    description:
      "Spot subtle shifts in mood, routines, or medication adherence with gentle trend lines and human-first language.",
    icon: TrendingUp,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
  },
]

const principles = [
  {
    title: "Design with dignity",
    description: "Typography, spacing, and color rooted in classic editorial layouts to keep focus on the humans involved.",
    icon: Heart,
  },
  {
    title: "Privacy by default",
    description: "Offline-first architecture, encrypted storage, and zero third-party data sharing.",
    icon: Shield,
  },
  {
    title: "Care-team alignment",
    description: "Invite family, clinicians, or professional aides to the same source of truth—on your terms.",
    icon: Users,
  },
]

const testimonials = [
  {
    quote:
      "Carelink helped our family notice early agitation signals before they escalated. The summaries read like a trusted colleague, not a robot.",
    name: "Olivia Martin",
    role: "Daughter & Care Coordinator",
    avatar: "OM",
  },
  {
    quote:
      "The weekly briefing blends clinical clarity with warmth. My staff starts shifts feeling grounded in each resident's story.",
    name: "Samuel Turner",
    role: "Director, GreenBridge Memory Care",
    avatar: "ST",
  },
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

const trustSignals = [
  "HIPAA Compliant",
  "SOC 2 Type II",
  "End-to-End Encrypted",
  "ISO 27001 Certified",
]

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/50">
          {/* Background Elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-violet-50/40" />
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-100/20 blur-3xl" />
            <div className="absolute right-1/4 top-20 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-100/20 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-24 pt-20 md:pt-32">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-6 rounded-full border-emerald-200 bg-emerald-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
                <Heart className="mr-2 inline-block h-3 w-3" />
                Care that remembers
              </Badge>

              <h1 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-5xl font-bold leading-[1.1] text-transparent md:text-7xl">
                A timeless workspace for caregivers and the stories they protect.
              </h1>

              <p className="mt-8 text-lg leading-relaxed text-slate-600 md:text-xl">
                Carelink weaves together journaling, private audio capture, and calm intelligence so you can stay ahead of
                changing needs—without losing the human moments that matter most.
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="group h-12 bg-emerald-600 px-8 text-base shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30">
                  <Link href="/signup">
                    Create your account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-2 border-slate-300 bg-white px-8 text-base text-slate-900 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50">
                  <Link href="/login">Preview the app</Link>
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                {trustSignals.map((signal, index) => (
                  <div key={signal} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-medium">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.label} className="group relative overflow-hidden border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
                    <CardContent className="relative p-8">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <p className="text-5xl font-bold text-slate-900">{item.label}</p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-b border-slate-200/50 bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 max-w-3xl">
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                PLATFORM CAPABILITIES
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Focused tools, crafted for longevity
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                From the first note you take to the insights you share with clinicians, Carelink brings calm structure to
                every touchpoint of memory care.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-opacity group-hover:opacity-100`} />

                    <div className="relative">
                      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-sm`}>
                        <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                      <p className="mt-4 leading-relaxed text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section id="approach" className="border-b border-slate-200/50 bg-gradient-to-b from-slate-50 to-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
              <div>
                <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                  OUR PHILOSOPHY
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  An ethos shaped by classic care
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-slate-600">
                  Carelink borrows from timeless design systems—Swiss grids, restrained palettes, thoughtful typography—so the
                  interface feels like a trusted notebook that just happens to understand context.
                </p>
              </div>

              <div className="grid gap-6">
                {principles.map((principle, index) => {
                  const Icon = principle.icon
                  return (
                    <div
                      key={principle.title}
                      className="group flex gap-4 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 transition-transform group-hover:scale-110">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{principle.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{principle.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="stories" className="border-b border-slate-200/50 bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 max-w-3xl">
              <Badge variant="outline" className="mb-4 border-slate-300 text-slate-600">
                TESTIMONIALS
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Field notes from Carelink caregivers
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-lg transition-all hover:border-slate-300 hover:shadow-xl md:p-10"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-100/20 to-blue-100/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-6 text-4xl text-emerald-600/20">"</div>

                    <blockquote className="text-lg leading-relaxed text-slate-700">
                      {testimonial.quote}
                    </blockquote>

                    <div className="mt-8 flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-slate-200">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.avatar}`} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900">{testimonial.name}</p>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <div
                  key={faq.question}
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Begin the next chapter of care
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-emerald-50">
              Join caregivers who balance empathy with preparation. Craft a living record that supports every decision,
              every handoff, every conversation.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="group h-12 border-2 border-white bg-white px-8 text-base text-emerald-700 shadow-xl transition-all hover:bg-emerald-50 hover:shadow-2xl">
                <Link href="/signup">
                  Create my account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="h-12 border-2 border-white/20 px-8 text-base text-white transition-all hover:border-white/40 hover:bg-white/10">
                <Link href="#features">Explore the product</Link>
              </Button>
            </div>
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
                Designed for caregivers protecting what's timeless. A workspace that brings calm structure to every touchpoint of memory care.
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
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Product</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <a href="#features" className="transition-colors hover:text-emerald-600">Features</a>
                </li>
                <li>
                  <a href="#approach" className="transition-colors hover:text-emerald-600">Approach</a>
                </li>
                <li>
                  <a href="#stories" className="transition-colors hover:text-emerald-600">Testimonials</a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-emerald-600">FAQ</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Company</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="/login" className="transition-colors hover:text-emerald-600">Sign in</Link>
                </li>
                <li>
                  <Link href="/signup" className="transition-colors hover:text-emerald-600">Create account</Link>
                </li>
                <li>
                  <a href="mailto:support@carelink.app" className="transition-colors hover:text-emerald-600">Support</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Carelink Collective. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
