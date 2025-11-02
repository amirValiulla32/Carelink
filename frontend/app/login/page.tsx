"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { getFirebaseAuth } from "@/lib/firebase"
import { SiteHeader } from "@/components/site-header"

const EMAIL_LINK_STORAGE_KEY = "carelink-auth-email-link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, authEnabled } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [magicEmail, setMagicEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [magicLinkMessage, setMagicLinkMessage] = useState<string | null>(null)
  const [needEmailConfirmation, setNeedEmailConfirmation] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "google" | "magic">("idle")
  const [error, setError] = useState<string | null>(null)

  const redirectPath = useMemo(() => searchParams.get("redirect") || "/app", [searchParams])

  useEffect(() => {
    if (!authEnabled) return
    if (!loading && user) {
      router.replace(redirectPath)
    }
  }, [authEnabled, user, loading, router, redirectPath])

  useEffect(() => {
    if (!authEnabled) return
    const auth = getFirebaseAuth()
    if (!auth) return

    if (typeof window === "undefined") return
    if (!isSignInWithEmailLink(auth, window.location.href)) return

    setStatus("magic")
    const storedEmail = window.localStorage.getItem(EMAIL_LINK_STORAGE_KEY) || ""

    if (!storedEmail) {
      setNeedEmailConfirmation(true)
      setStatus("idle")
      return
    }

    setMagicEmail(storedEmail)
    completeEmailLinkSignIn(storedEmail)
  }, [authEnabled])

  const completeEmailLinkSignIn = async (linkEmail: string) => {
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        setError("Authentication is not configured. Please contact the administrator.")
        setStatus("idle")
        return
      }
      await signInWithEmailLink(auth, linkEmail, window.location.href)
      window.localStorage.removeItem(EMAIL_LINK_STORAGE_KEY)
      setMagicLinkMessage("You're signed in. Redirecting…")
      router.replace(redirectPath)
    } catch (err) {
      console.error(err)
      setError("We couldn't verify that link. Please request a new one.")
      setStatus("idle")
    }
  }

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStatus("submitting")

    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        setError("Authentication is not configured. Please contact the administrator.")
        setStatus("idle")
        return
      }
      await signInWithEmailAndPassword(auth, email, password)
      router.replace(redirectPath)
    } catch (err) {
      console.error(err)
      setError("We couldn't sign you in with those details. Please try again.")
      setStatus("idle")
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setStatus("google")
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        setError("Authentication is not configured. Please contact the administrator.")
        setStatus("idle")
        return
      }
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })
      await signInWithPopup(auth, provider)
      router.replace(redirectPath)
    } catch (err) {
      console.error(err)
      setError("Google sign-in was cancelled or unavailable.")
      setStatus("idle")
    }
  }

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicEmail) {
      setError("Please enter an email address to send the magic link.")
      return
    }
    setError(null)
    setStatus("magic")
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        setError("Authentication is not configured. Please contact the administrator.")
        setStatus("idle")
        return
      }
      await sendSignInLinkToEmail(auth, magicEmail, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      })
      window.localStorage.setItem(EMAIL_LINK_STORAGE_KEY, magicEmail)
      setMagicLinkSent(true)
      setMagicLinkMessage("Magic link sent. Check your email to continue.")
      setStatus("idle")
    } catch (err) {
      console.error(err)
      setError("We couldn't send the link. Please verify the email and try again.")
      setStatus("idle")
    }
  }

  const handleConfirmEmailForLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicEmail) {
      setError("Please confirm the email address you used to request the link.")
      return
    }
    setError(null)
    setStatus("magic")
    try {
      await completeEmailLinkSignIn(magicEmail)
    } finally {
      setStatus("idle")
    }
  }

  const isProcessing = status !== "idle"

  if (!authEnabled) {
    return (
      <div className="min-h-screen bg-[#f7f4f0]">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
          <Card className="border-[#efe6da] bg-white shadow-xl shadow-primary/5">
            <CardContent className="space-y-6 p-10">
              <h1 className="text-3xl font-semibold text-slate-900">Authentication is disabled</h1>
              <p className="text-base leading-relaxed text-slate-600">
                Firebase credentials are not configured in this environment. Add your <code>NEXT_PUBLIC_FIREBASE_*</code>{" "}
                keys to a <code>.env.local</code> file or contact the workspace owner to enable sign-in features.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f4f0]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col justify-center px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Welcome back
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Sign in to continue your care journey</h1>
            <p className="text-base leading-relaxed text-slate-700 md:text-lg">
              Access your private workspace, revisit moments that matter, and keep everyone on the same page—calmly and
              securely.
            </p>

            <div className="rounded-2xl border border-[#efe6da] bg-[#fdfaf5] p-6 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">What happens next?</p>
              <ul className="mt-3 space-y-3 list-disc pl-5">
                <li>Capture new observations or recordings with one click.</li>
                <li>Invite trusted collaborators to shared timelines.</li>
                <li>Receive gentle highlights that surface what changed.</li>
              </ul>
            </div>
          </div>

          <Card className="border-[#efe6da] bg-white shadow-xl shadow-primary/5">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>
                <p className="text-sm text-slate-600">Choose the method that suits your day.</p>
              </div>

              {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
              {magicLinkMessage && !error && (
                <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{magicLinkMessage}</p>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 bg-white text-slate-900"
                disabled={isProcessing}
                onClick={handleGoogleSignIn}
              >
                {status === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue with Google
              </Button>

              <div className="relative py-2 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
                <span className="bg-white px-3">OR</span>
                <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
              </div>

              <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@careteam.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {status === "submitting" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign in with password
                </Button>
              </form>

              <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
                <p className="text-sm font-medium text-slate-800">Prefer a link instead?</p>
                <form onSubmit={needEmailConfirmation ? handleConfirmEmailForLink : handleSendMagicLink} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="magic-email">{needEmailConfirmation ? "Confirm email" : "Email"}</Label>
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="you@careteam.com"
                      value={magicEmail}
                      onChange={(event) => setMagicEmail(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full" disabled={isProcessing}>
                    {status === "magic" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {needEmailConfirmation ? "Confirm & sign in" : magicLinkSent ? "Resend magic link" : "Email me a magic link"}
                  </Button>
                </form>
              </div>

              <p className="text-center text-sm text-slate-600">
                New to Carelink?{" "}
                <Link href="/signup" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
