"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { briefingService, MissionBriefResult } from "@/services/briefing/briefing-service"
import { MatchOverview } from "@/components/briefing/match-overview"
import { VolunteerSummary } from "@/components/briefing/volunteer-summary"
import { AIBrief } from "@/components/briefing/ai-brief"
import { RiskPanel } from "@/components/briefing/risk-panel"
import { ActionPanel } from "@/components/briefing/action-panel"
import { CardGlass } from "@/components/ui/card-glass"
import { Button } from "@/components/ui/button"
import { 
  Compass, 
  ArrowRight, 
  Loader2, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Terminal,
  Clock,
  Cpu
} from "lucide-react"
import { motion } from "framer-motion"

export default function BriefingPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "empty">("idle")
  const [brief, setBrief] = useState<MissionBriefResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState("")

  const fetchBrief = async (email: string) => {
    setStatus("loading")
    setError(null)
    try {
      const result = await briefingService.getMissionBrief(email)
      if (result && result.success) {
        setBrief(result)
        setStatus("success")
      } else {
        setError(result?.reason || "Operational coordinates missing.")
        setStatus("empty")
      }
    } catch (err: any) {
      console.error("Error fetching briefing profile:", err)
      setError(err.message || "Failed to reach operations decision core.")
      setStatus("error")
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchBrief(user.email)
    }
  }, [user])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRetry = () => {
    if (user?.email) {
      fetchBrief(user.email)
    }
  }

  const handleBeginMission = () => {
    router.push("/dashboard")
  }

  // --- RENDER SKELETON LOADER ---
  if (status === "loading" || status === "idle") {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] text-slate-100 flex items-center justify-center font-mono text-xs">
          <div className="flex flex-col items-center gap-4">
            <Cpu className="size-8 animate-spin text-cyan-405" />
            <span>COMPILING MISSION PARAMETERS...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // --- RENDER ERROR STATE ---
  if (status === "error") {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6 relative font-sans">
          <CardGlass className="w-full max-w-[440px] border border-rose-500/20 bg-slate-950/40 p-8 select-none text-center space-y-6" hoverEffect={false}>
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">Briefing Pipeline Offline</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {error || "An unexpected network error occurred while compiling today's operations parameters."}
              </p>
            </div>
            <Button
              onClick={handleRetry}
              className="w-full py-5 text-xs font-bold font-mono tracking-widest uppercase rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-450 hover:bg-rose-900/30 hover:shadow-lg hover:shadow-rose-950/25 active:translate-y-px transition-all duration-300 gap-2 flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>Retry Telemetry Fetch</span>
            </Button>
          </CardGlass>
        </div>
      </ProtectedRoute>
    )
  }

  // --- RENDER EMPTY STATE (Graceful fallbacks) ---
  if (status === "empty" || !brief || !brief.volunteer || !brief.match || !brief.recommendations) {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6 relative font-sans">
          <CardGlass className="w-full max-w-[440px] border border-white/[0.04] bg-slate-950/40 p-8 select-none text-center space-y-6" hoverEffect={false}>
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-455">
              <Database className="size-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-350 font-mono">Operations Setup Incomplete</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {error || "We could not find your active volunteer profile or scheduled match parameters in Firestore."}
              </p>
            </div>
            <div className="border border-white/[0.03] bg-white/[0.01] p-3 rounded-lg text-[10px] font-mono text-slate-500 text-left space-y-1.5 leading-relaxed">
              <span className="block font-bold text-slate-400">Auditing Checklist:</span>
              <span>1. Check that a document matches your email in the 'volunteers' collection.</span>
              <span>2. Check that at least one document exists in the 'matches' collection.</span>
            </div>
            <Button
              onClick={handleRetry}
              className="w-full py-5 text-xs font-bold font-mono tracking-widest uppercase rounded-xl border border-white/[0.08] bg-slate-900 text-slate-300 hover:bg-slate-800 transition-all duration-300 gap-2 flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>Retry Query Check</span>
            </Button>
          </CardGlass>
        </div>
      </ProtectedRoute>
    )
  }

  // --- RENDER SUCCESS BRIEFING STATE ---
  return (
    <ProtectedRoute>
      <div className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col font-sans select-none overflow-hidden justify-between relative scanline-sweep noise-bg">
        {/* Soft Blue Ambient Lighting Spotlight */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none z-0" />

        {/* Background Grid Backing */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.02),transparent_70%)] pointer-events-none z-0" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* Header */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center p-1.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-400">
              <Terminal className="size-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                  AEGIS BRIEFING DECK
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h1 className="text-sm font-black tracking-tight text-white uppercase">
                AI Cognitive Operational Briefing
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-white/[0.08] text-slate-300 font-mono text-[9px] font-bold uppercase rounded cursor-pointer"
            >
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/60 border border-white/[0.04]">
              <span className="text-slate-500">COGNITIVE SYNC:</span>
              <span className="text-cyan-400 font-bold animate-pulse">ACTIVE</span>
            </div>

            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-sm bg-slate-950 px-3 py-1 rounded border border-cyan-500/10">
              <Clock className="size-3.5" />
              <span>{currentTime}</span>
            </div>
          </div>
        </header>

        {/* Main Grid Content */}
        <main className="flex-1 min-h-0 flex gap-4 p-4 z-10">
          
          {/* Left Column - Match Overview & Directives Checklist (62% width) */}
          <div className="w-[62%] flex flex-col gap-4 overflow-y-auto pr-2 max-h-full">
            {/* Match overview Card */}
            <MatchOverview match={brief.match} />

            {/* Action directives checklist */}
            <ActionPanel recommendations={brief.recommendations} />
          </div>

          {/* Right Column - User summary, AI brief details, Risk Panel, Begin shift CTA (38% width) */}
          <div className="w-[38%] flex flex-col gap-4 overflow-y-auto pr-2 max-h-full justify-between">
            <div className="space-y-4">
              {/* Volunteer summary Badge */}
              <VolunteerSummary volunteer={brief.volunteer} />

              {/* AI Brief details accuracy/latency */}
              <AIBrief 
                modelName={brief.aiModel || "Groq Llama-3-8b"} 
                latencyMs={brief.latencyMs || 0} 
                overallConfidence={brief.recommendations[0]?.confidence || 90} 
              />

              {/* Telemetry Risk Checklist */}
              <RiskPanel />
            </div>

            {/* Primary Begin Mission CTA Action */}
            <div className="pt-2">
              <Button
                onClick={handleBeginMission}
                className="w-full py-5 text-xs font-mono tracking-widest font-bold rounded-xl border bg-cyan-600 border-cyan-400/30 text-slate-950 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-950/20 active:translate-y-px transition-all duration-300 gap-2 flex items-center justify-center cursor-pointer"
              >
                <span>Initialize Operations Command Deck</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

        </main>

        {/* Ticker Footer */}
        <footer className="h-8 shrink-0 bg-slate-950/80 border-t border-white/[0.06] flex items-center overflow-hidden z-10 select-none relative">
          <div className="absolute left-0 px-3 py-1 bg-cyan-600 text-slate-950 font-mono text-[9px] font-extrabold tracking-wider uppercase z-20 shadow-md">
            Operational status
          </div>
          
          <div className="flex-1 w-full overflow-hidden relative">
            <motion.div
              animate={{ x: ["5%", "-95%"] }}
              transition={{ ease: "linear", duration: 35, repeat: Infinity }}
              className="inline-block whitespace-nowrap text-[10px] font-mono tracking-widest text-cyan-400 font-bold"
            >
              COGNITIVE OPERATIONS COMPILED STATUS OK   •   MATCH: {brief.match.match.toUpperCase()}   •   VENUE: {brief.match.venue.toUpperCase()}   •   KICKOFF TELEMETRY ARMED
            </motion.div>
          </div>
        </footer>

      </div>
    </ProtectedRoute>
  )
}
