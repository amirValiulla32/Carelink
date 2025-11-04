"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { getFirebaseAuth } from "@/lib/firebase"

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#approach", label: "Approach" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
]

export function SiteHeader() {
  const { user, authEnabled } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isOnApp = pathname?.startsWith("/app")
  const isOnLogin = pathname === "/login"
  const isOnSignup = pathname === "/signup"

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        return
      }
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-muted/40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            CL
          </span>
          Carelink
        </Link>

        {!isOnApp && (
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!isOnApp && (
            <Button variant="ghost" size="sm" onClick={() => router.push("/app")}>
              Enter app
            </Button>
          )}

          {authEnabled ? (
            user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            ) : (
              <>
                {!isOnLogin && (
                  <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                    Sign in
                  </Button>
                )}
                {!isOnSignup && (
                  <Button size="sm" onClick={() => router.push("/signup")}>
                    Get started
                  </Button>
                )}
              </>
            )
          ) : null}
        </div>
      </div>
    </header>
  )
}
