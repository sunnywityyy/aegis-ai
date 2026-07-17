"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { LoginForm } from "@/features/auth/login-form"
import { CardGlass } from "@/components/ui/card-glass"
import { Compass, Loader2, Clock, ShieldAlert, Terminal, Lock, Globe, Cpu } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState("")
  const [logIndex, setLogIndex] = useState(0)

  const securityLogs = [
    "Aegis security handshake active...",
    "Scanning MetLife gateway port 3000...",
    "Loading credential validation schemas...",
    "Priming volunteer roster database...",
    "Ready for operator cryptographic signature."
  ]

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    const logTimer = setInterval(() => {
      setLogIndex(prev => (prev + 1) % securityLogs.length)
    }, 4000)

    return () => {
      clearInterval(timer)
      clearInterval(logTimer)
    }
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center text-slate-100 select-none">
        <Loader2 className="size-6 animate-spin text-cyan-405" />
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden relative justify-between scanline-sweep noise-bg">
      
      {/* Soft Blue Ambient Lighting Spotlight */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none z-0" />

      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.02),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center p-1.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-405">
            <Compass className="size-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                AEGIS OPS AUTH
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-white uppercase">
              Operations Authorization Desk
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-sm bg-slate-950 px-3 py-1 rounded border border-cyan-500/10">
          <Clock className="size-3.5" />
          <span>{currentTime}</span>
        </div>
      </header>

      {/* Main Form Center Layout */}
      <main className="flex-1 min-h-0 flex items-center justify-center relative z-10 px-4">
        
        {/* Holographic glowing lines in background */}
        <div className="absolute w-[600px] h-[350px] border border-cyan-500/5 rounded-full filter blur-xl opacity-30 select-none pointer-events-none" />

        <div className="w-full max-w-[850px] grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-slate-950/20 backdrop-blur-md p-6 rounded-2xl shadow-2xl hologram-glow hologram-glow-hover">
          
          {/* Left Block: Crypto Terminal Status */}
          <div className="flex flex-col gap-4 border-r border-white/[0.04] pr-6 select-none justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">TELEMETRY ACCESS MATRIX</span>
              </div>
              <h2 className="text-xl font-black text-slate-200 uppercase tracking-tight">Security Handshake Required</h2>
              <p className="text-xs text-slate-450 leading-relaxed font-mono">
                Aegis AI validates volunteer credentials directly against MetLife FIFA WC-2026 directory records. All connection packets are encrypted.
              </p>
            </div>

            {/* Terminal logs monitor */}
            <div className="bg-slate-950/80 border border-white/[0.03] p-3.5 rounded-xl font-mono text-[9px] text-slate-400 space-y-1.5 mt-4">
              <div className="flex items-center gap-2 border-b border-white/[0.04] pb-1 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[8px] font-bold text-slate-500 uppercase">SYS SECURE CONSOLE</span>
              </div>
              <div>&gt; {securityLogs[logIndex]}</div>
              <div className="text-[8px] text-slate-650 uppercase">PACKETS: SYNCED // TLS 1.3 // AES-256</div>
            </div>

            {/* Mock stats widget */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.03] text-[9px] font-mono text-slate-500">
              <div>HOST: PORT_3000</div>
              <div>ROUTER: METLIFE_LOCAL</div>
            </div>
          </div>

          {/* Right Block: Standard Login form */}
          <div className="flex flex-col justify-center">
            <LoginForm />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="h-8 shrink-0 bg-slate-950/80 border-t border-white/[0.06] flex items-center overflow-hidden z-10 select-none relative">
        <div className="absolute left-0 px-3 py-1 bg-cyan-600 text-slate-950 font-mono text-[9px] font-extrabold tracking-wider uppercase z-20 shadow-md">
          Access Stream
        </div>
        
        <div className="flex-1 w-full overflow-hidden relative">
          <motion.div
            animate={{ x: ["5%", "-95%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            className="inline-block whitespace-nowrap text-[10px] font-mono tracking-widest text-cyan-400 font-bold"
          >
            AEGIS OPS AUTH LAYER   •   TLS SOCKET HANDSHAKE SYNCED   •   SECURE VOLUNTEER CREDENTIAL PORTAL ACTIVE   •   WC-2026 TELEMETRY GATE
          </motion.div>
        </div>
      </footer>

    </div>
  )
}

