import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Carelink | Compassionate Memory Support",
  description:
    "Carelink helps caregivers capture meaningful moments, track progress, and stay ahead of changing needs with calm, timeless tools.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
