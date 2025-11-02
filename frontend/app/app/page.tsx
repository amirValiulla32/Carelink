"use client"

import CarelinkApp from "@/carelink-app"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SiteHeader } from "@/components/site-header"

export default function AppWorkspacePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fdfcf9]">
        <SiteHeader />
        <CarelinkApp />
      </div>
    </ProtectedRoute>
  )
}
