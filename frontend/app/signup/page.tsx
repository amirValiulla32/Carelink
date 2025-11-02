"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { getFirebaseAuth } from "@/lib/firebase"
import { SiteHeader } from "@/components/site-header"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, authEnabled } = useAuth()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "google">("idle")
  const [error, setError] = useState<string | null>(null)

  const redirectPath = searchParams.get("redirect") || "/app"

  useEffect(() => {
    if (!authEnabled) return
    if (!loading && user) {
      router.replace(redirectPath)
    }
  }, [authEnabled, user, loading, router, redirectPath])

  const handleEmailSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError("Please share your name so we know how to greet you.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.")
      return
    }

    setStatus("submitting")
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        setError("Authentication is not configured. Please contact the administrator.")
        setStatus("idle")
        return
      }
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)

      if (fullName.trim()) {
        await updateProfile(credential.user, { displayName: fullName.trim() })
      }

      router.replace(redirectPath)
    } catch (err) {
      console.error(err)
      setError("We couldn't create your account. This email may already be registered.")
      setStatus("idle")
    }
  }

  const handleGoogleSignup = async () => {
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
      setError("Google sign-up was cancelled or unavailable.")
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
              <h1 className="text-3xl font-semibold text-slate-900">Sign up is unavailable</h1>
              <p className="text-base leading-relaxed text-slate-600">
                Firebase credentials are not configured. Add your <code>NEXT_PUBLIC_FIREBASE_*</code> keys to a{" "}
                <code>.env.local</code> file or contact the workspace owner to enable account creation.
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
              Join Carelink
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Create a home for your care stories</h1>
            <p className="text-base leading-relaxed text-slate-700 md:text-lg">
              Capture the everyday details that help families and clinicians stay aligned. Carelink keeps them organized,
              private, and ready when you need them.
            </p>

            <div className="rounded-2xl border border-[#efe6da] bg-[#fdfaf5] p-6 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">With your account you can</p>
              <ul className="mt-3 space-y-3 list-disc pl-5">
                <li>Record audio reflections that transcribe instantly, privately.</li>
                <li>Track medication, mood, and notable moments in one timeline.</li>
                <li>Generate exports for clinicians without compromising context.</li>
              </ul>
            </div>
          </div>

          <Card className="border-[#efe6da] bg-white shadow-xl shadow-primary/5">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-slate-900">Create your Carelink account</h2>
                <p className="text-sm text-slate-600">You can change plans or invite collaborators anytime.</p>
              </div>

              {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 bg-white text-slate-900"
                disabled={isProcessing}
                onClick={handleGoogleSignup}
              >
                {status === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign up with Google
              </Button>

              <div className="relative py-2 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
                <span className="bg-white px-3">OR</span>
                <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
              </div>

              <form className="space-y-4" onSubmit={handleEmailSignup}>
                <div className="space-y-2">
                  <Label htmlFor="full-name">Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Taylor Caretaker"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>
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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {status === "submitting" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create account
                </Button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Prefer password-less access?{" "}
                <Link href="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                  Request a magic link
                </Link>
              </p>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
