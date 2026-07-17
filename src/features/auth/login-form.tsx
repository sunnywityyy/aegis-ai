"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "./auth-service"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff, Lock, Mail } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please specify both email and password credentials.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await authService.signIn(email, password)
      router.push("/dashboard") // Route to dashboard command center after login
    } catch (err: any) {
      console.error("Login failure:", err)
      
      // User-friendly Firebase auth errors
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email address or operational code.")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email syntax. Please double check.")
      } else {
        setError(err.message || "Authentication failed. Please verify credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-xs text-rose-450 border border-rose-500/20 bg-rose-500/5 rounded-lg select-none font-mono">
          {error}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5 relative">
        <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 font-semibold select-none">
          Operational Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-500 pointer-events-none" />
          <input
            type="email"
            placeholder="volunteer@aegis.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-white/[0.06] rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all duration-300 font-mono"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5 relative">
        <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 font-semibold select-none">
          Security Code
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 size-4 text-slate-500 pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-10 py-3 bg-slate-950/60 border border-white/[0.06] rounded-xl text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-cyan-500/30 transition-all duration-300 font-mono"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Submit Action */}
      <Button
        type="submit"
        disabled={loading}
        className={`w-full py-6 text-xs font-bold font-mono tracking-widest uppercase rounded-xl border cursor-pointer transition-all duration-300 gap-2 flex items-center justify-center ${
          loading
            ? "bg-slate-900/40 border-white/[0.04] text-slate-600 cursor-not-allowed opacity-50"
            : "bg-cyan-600 border-cyan-400/30 text-slate-950 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-950/20 active:translate-y-px"
        }`}
      >
        {loading && <Loader2 className="size-3.5 animate-spin text-slate-500 mr-1" />}
        <span>{loading ? "Verifying..." : "Sign In"}</span>
      </Button>
    </form>
  )
}
