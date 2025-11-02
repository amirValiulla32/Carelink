import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"

const highlights = [
  {
    label: "96%",
    description: "of caregivers reported calmer evenings after two weeks.",
  },
  {
    label: "12hr",
    description: "average time saved each month on manual note keeping.",
  },
  {
    label: "180K",
    description: "moments captured and searchable across Carelink teams.",
  },
]

const features = [
  {
    title: "Soft-guided journaling",
    description:
      "Capture daily observations with structured prompts that feel like a conversation, not homework.",
  },
  {
    title: "Private audio reflections",
    description:
      "Record and transcribe key moments locally. All processing stays on your device for complete peace of mind.",
  },
  {
    title: "Long-view insights",
    description:
      "Spot subtle shifts in mood, routines, or medication adherence with gentle trend lines and human-first language.",
  },
]

const principles = [
  {
    title: "Design with dignity",
    description: "Typography, spacing, and color rooted in classic editorial layouts to keep focus on the humans involved.",
  },
  {
    title: "Privacy by default",
    description: "Offline-first architecture, encrypted storage, and zero third-party data sharing.",
  },
  {
    title: "Care-team alignment",
    description: "Invite family, clinicians, or professional aides to the same source of truth—on your terms.",
  },
]

const testimonials = [
  {
    quote:
      "Carelink helped our family notice early agitation signals before they escalated. The summaries read like a trusted colleague, not a robot.",
    name: "Olivia Martin",
    role: "Daughter & Care Coordinator",
  },
  {
    quote:
      "The weekly briefing blends clinical clarity with warmth. My staff starts shifts feeling grounded in each resident’s story.",
    name: "Samuel Turner",
    role: "Director, GreenBridge Memory Care",
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

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f4f0] text-slate-900">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[#f0ebe4]" />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 transform">
              <div className="h-96 w-[60rem] rounded-full bg-primary/5 blur-3xl" />
            </div>
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28">
            <div className="max-w-3xl">
              <Badge className="mb-6 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Care that remembers
              </Badge>
              <h1 className="text-4xl font-semibold leading-[1.15] text-slate-900 md:text-6xl">
                A timeless workspace for caregivers and the stories they protect.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">
                Carelink weaves together journaling, private audio capture, and calm intelligence so you can stay ahead of
                changing needs—without losing the human moments that matter most.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Create your account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-300 bg-white text-slate-900">
                  <Link href="/login">Preview the app</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.label} className="border-none bg-white/70 shadow-sm backdrop-blur">
                  <CardContent className="p-6">
                    <p className="text-4xl font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-[#e8e1d8] bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Focused tools, crafted for longevity</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                From the first note you take to the insights you share with clinicians, Carelink brings calm structure to
                every touchpoint of memory care.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-[#efe6da] bg-[#fdfaf5] p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="bg-[#f4efe9] py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-center">
            <div className="md:w-2/5">
              <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">An ethos shaped by classic care</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Carelink borrows from timeless design systems—Swiss grids, restrained palettes, thoughtful typography—so the
                interface feels like a trusted notebook that just happens to understand context.
              </p>
            </div>
            <div className="grid flex-1 gap-6 md:grid-cols-3">
              {principles.map((principle) => (
                <div key={principle.title} className="rounded-xl border border-[#e5ddd3] bg-white p-5">
                  <h3 className="text-base font-semibold text-slate-900">{principle.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="border-t border-[#e8e1d8] bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Field notes from Carelink caregivers</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="rounded-2xl border border-[#efe6da] bg-[#fdfaf5] p-8 text-slate-700 shadow-sm"
                >
                  <p className="text-lg leading-relaxed">
                    “{testimonial.quote}”
                  </p>
                  <footer className="mt-6">
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{testimonial.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#f7f4f0] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Questions, answered with care</h2>
            <div className="mt-10 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-[#e7e0d6] bg-white/70 p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e8e1d8] bg-white py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Begin the next chapter of care</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Join caregivers who balance empathy with preparation. Craft a living record that supports every decision,
              every handoff, every conversation.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">Create my account</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-slate-700">
                <Link href="#features">Explore the product</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dfd5c7] bg-[#f1ede7] py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-800">Carelink</p>
            <p className="mt-1">Designed for caregivers protecting what’s timeless.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/login" className="hover:text-slate-900">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-slate-900">
              Create account
            </Link>
            <a href="mailto:support@carelink.app" className="hover:text-slate-900">
              support@carelink.app
            </a>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()} Carelink Collective</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
