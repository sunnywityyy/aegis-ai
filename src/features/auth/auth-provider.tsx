"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User as FirebaseUser } from "firebase/auth"
import { authService } from "./auth-service"

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncUser = () => {
      const mockUserJson = localStorage.getItem("aegis_mock_user")
      if (mockUserJson) {
        setUser(JSON.parse(mockUserJson))
        setLoading(false)
      } else {
        setUser(null)
      }
    }

    if (typeof window !== "undefined") {
      syncUser()
      window.addEventListener("auth-state-change", syncUser)
    }

    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      if (typeof window !== "undefined" && !localStorage.getItem("aegis_mock_user")) {
        setUser(firebaseUser)
        setLoading(false)
      } else if (typeof window === "undefined") {
        setUser(firebaseUser)
        setLoading(false)
      }
    })

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-state-change", syncUser)
      }
      unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
