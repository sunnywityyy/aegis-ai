"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Route protection wrapper component. Intercepts client-side navigation,
 * displaying a premium operations loading state during verification and
 * redirecting unauthenticated sessions to /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 select-none font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-cyan-405" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
            Verifying Operations Session
          </span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
