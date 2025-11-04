"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/providers/auth-provider"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, authEnabled } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!authEnabled) {
      return
    }

    if (!loading && !user) {
      const target =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/app"
      router.replace(`/login?redirect=${encodeURIComponent(target)}`)
    }
  }, [authEnabled, loading, user, router])

  if (!authEnabled) {
    return <>{children}</>
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f7f4f0] text-slate-700">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Carelink</p>
        <p className="mt-4 text-lg">Preparing your workspace…</p>
      </div>
    )
  }

  return <>{children}</>
}
