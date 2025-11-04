"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"
import { getFirebaseAuth, isFirebaseEnabled } from "@/lib/firebase"

type AuthContextValue = {
  user: User | null
  loading: boolean
  authEnabled: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authEnabled, setAuthEnabled] = useState(isFirebaseEnabled())

  useEffect(() => {
    let isMounted = true

    if (!isFirebaseEnabled()) {
      setAuthEnabled(false)
      setLoading(false)
      setUser(null)
      return
    }

    try {
      const auth = getFirebaseAuth()

      if (!auth) {
        setAuthEnabled(false)
        setLoading(false)
        return
      }

      setAuthEnabled(true)
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (isMounted) {
          setUser(firebaseUser)
          setLoading(false)
        }
      })

      return () => {
        isMounted = false
        unsubscribe()
      }
    } catch (error) {
      console.error("Failed to initialize Firebase auth:", error)
      setAuthEnabled(false)
      setLoading(false)
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      authEnabled,
    }),
    [user, loading, authEnabled]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
