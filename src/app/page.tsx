"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/features/auth/auth-provider"
import { 
  Terminal, 
  ArrowRight, 
  Clock, 
  Activity, 
  Users, 
  Shield, 
  Compass, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Cpu, 
  Sparkles,
  Zap,
  Globe
} from "lucide-react"

// Simple CountUp helper
function CountUp({ value, duration = 1.0 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const startValue = 0
    const endValue = value

    const animateVal = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const currentVal = Math.floor(progress * (endValue - startValue) + startValue)
      setDisplayValue(currentVal)
      if (progress < 1) {
        requestAnimationFrame(animateVal)
      }
    }

    requestAnimationFrame(animateVal)
  }, [value, duration])

  return <span>{displayValue.toLocaleString()}</span>
}

function TypingText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let index = 0
    setDisplayedText("")
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index))
      index++
      if (index >= text.length) {
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayedText}</span>
}

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [currentTime, setCurrentTime] = useState("")
  const [mounted, setMounted] = useState(false)
  const [logIndex, setLogIndex] = useState(0)

  const rawLogs = [
    "Establishing secure orbital link...",
    "Telemetry handshake synchronized...",
    "Querying Firestore volunteers collection...",
    "Loading Aegis Decision Engine assets...",
    "Groq Llama-3-8b context primed...",
    "MetLife perimeter telemetry nominal."
  ]

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % rawLogs.length)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(logTimer)
    }
  }, [])

  const handleBeginShift = () => {
    localStorage.setItem("aegis_mock_user", JSON.stringify({ email: "volunteer@aegis.ai", uid: "demo-judge-uid" }))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-state-change"))
    }
    router.push("/dashboard")
  }

  if (!mounted || authLoading) {
    return (
      <div className="h-screen w-screen bg-[#020617] text-slate-100 flex items-center justify-center font-mono text-xs">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="size-8 animate-spin text-cyan-400" />
          <span>CONNECTING TO AEGIS CORE NETWORK...</span>
        </div>
      </div>
    )
  }

  // Priorities list
  const priorities = [
    { id: "MP-01", title: "ACCESSIBILITY PATH ONLINE", val: "Optimal", color: "text-emerald-400", confidence: 98 },
    { id: "MP-02", title: "METRO SURGE PREDICTION", val: "Busy (18:30)", color: "text-amber-400", confidence: 84 },
    { id: "MP-03", title: "BILINGUAL SHIFT ALLOCATION", val: "Spanish Priority", color: "text-orange-400", confidence: 91 }
  ]

  return (
    <div className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col font-sans select-none overflow-hidden relative scanline-sweep noise-bg">
      {/* Soft Blue Ambient Lighting Spotlight */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none z-0" />

      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center p-1.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-400">
            <Compass className="size-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                AEGIS GATEWAY LAYER
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-white uppercase">
              FIFA OPERATIONS SYSTEM INITIALIZATION
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/60 border border-white/[0.04]">
            <Globe className="size-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 uppercase text-[9px]">SERVER SECURE</span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-sm bg-slate-950 px-3 py-1 rounded border border-cyan-500/10">
            <Clock className="size-3.5" />
            <span>{currentTime || "00:00:00"}</span>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 min-h-0 flex gap-4 p-4 z-10">
        
        {/* Left Column: Welcome & Shift details */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[28%] flex flex-col gap-3 min-h-0"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-1.5 shrink-0">
            <Activity className="size-4 text-cyan-400" />
            <h2 className="text-xs font-extrabold tracking-widest font-mono text-slate-300 uppercase">TELEMETRY ACCESS GATE</h2>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pr-1">
            
            {/* Operator greeting */}
            <div className="bg-slate-950/40 rounded-xl p-4 space-y-1 transition-colors hologram-glow hologram-glow-hover">
              <span className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">SECURITY CLEARANCE</span>
              <h3 className="text-base font-black text-slate-200">
                {user ? `Operator: ${user.email?.split("@")[0].toUpperCase()}` : "GUEST VISITOR DETECTED"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Verify credentials to establish cognitive briefing parameters.
              </p>
            </div>

            {/* Shift Logistics details widgets */}
            <div className="bg-slate-950/40 rounded-xl p-4 flex flex-col gap-3 transition-colors hologram-glow hologram-glow-hover">
              <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">SHIFT PARAMETERS</span>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 border border-white/[0.04] text-cyan-400">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-mono text-slate-500">CURRENT SHIFT</span>
                  <span className="text-xs font-bold text-slate-300">18:00 — 22:00</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 border border-white/[0.04] text-cyan-400">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-mono text-slate-500">VOLUNTEER ZONE</span>
                  <span className="text-xs font-bold text-slate-300">East Entrance (Gate C)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 border border-white/[0.04] text-cyan-400">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-mono text-slate-500">ASSIGNED ROLE</span>
                  <span className="text-xs font-bold text-slate-300">Guest Assistance Team</span>
                </div>
              </div>
            </div>

            {/* Terminal monitor logs */}
            <div className="bg-slate-950/40 rounded-xl p-4 flex flex-col gap-1.5 relative overflow-hidden shrink-0 mt-auto hologram-glow hologram-glow-hover">
              <span className="text-[9px] font-mono text-cyan-405 font-bold uppercase tracking-wider">GATEWAY NETWORK LOG</span>
              <div className="font-mono text-[9px] bg-slate-950/80 p-3 rounded border border-white/[0.02] text-slate-400 leading-normal">
                &gt; <TypingText text={rawLogs[logIndex]} speed={25} />
                <br />
                <span className="text-slate-600">&gt; Scanning MetLife infrastructure... OK</span>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Center Column: Futuristic Holographic Blueprint Scan (44% width) */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[44%] flex flex-col min-h-0 border border-white/[0.05] bg-slate-950/20 backdrop-blur-md rounded-2xl p-4 relative justify-center items-center overflow-hidden"
        >
          {/* Visual Sonar overlay scanning */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-500/40 select-none pointer-events-none uppercase">
            MetLife Blueprint Telemetry Map
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.02),transparent_75%)] pointer-events-none" />

          {/* Animated Sonar scanner visual */}
          <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center border border-white/[0.03] bg-slate-950/40 rounded-full overflow-hidden">
            {/* Spinning Sonar beam */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              style={{ originX: "50%", originY: "50%" }}
              className="absolute inset-0 border-r border-cyan-400/20 bg-gradient-to-tr from-cyan-400/5 to-transparent rounded-full"
            />
            {/* Pulsing rings */}
            <motion.div 
              animate={{ scale: [0.2, 1.2], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
              className="absolute h-3/4 w-3/4 border border-cyan-400/10 rounded-full"
            />
            <motion.div 
              animate={{ scale: [0.1, 1], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1.5, ease: "easeOut" }}
              className="absolute h-1/2 w-1/2 border border-cyan-400/10 rounded-full"
            />

            {/* Stadium Blueprint Outline representation */}
            <div className="absolute w-[65%] h-[40%] border-2 border-cyan-500/20 rounded-full flex items-center justify-center">
              <div className="w-[80%] h-[70%] border border-cyan-500/10 rounded-full flex items-center justify-center">
                <div className="w-[50%] h-[50%] bg-cyan-950/20 border border-cyan-400/20 rounded flex items-center justify-center">
                  <Activity className="size-4 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Gate indicator nodes (glowing dots) */}
            <div className="absolute top-[28%] left-[28%] h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="absolute top-[28%] right-[28%] h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="absolute bottom-[28%] left-[28%] h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <div className="absolute bottom-[28%] right-[28%] h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </div>

          <div className="text-center mt-6 space-y-1 relative z-10">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">INFRASTRUCTURE STATUS: NOMINAL</div>
            <div className="text-[10px] font-mono text-slate-500">GRID SYNC RATIO: 99.8% // CHANNELS: DEPLOYED</div>
          </div>
        </motion.section>

        {/* Right Column: AI prioritiy feed & Core Actions (28% width) */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[28%] flex flex-col gap-3 min-h-0"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan-400 animate-pulse" />
              <h2 className="text-xs font-extrabold tracking-widest font-mono text-slate-300 uppercase">MISSION OBJECTIVES</h2>
            </div>
            <span className="text-[8px] font-mono text-slate-500">AEGIS_DECISION_ENGINE</span>
          </div>

          {/* Body items */}
          <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pr-1">
            
            {/* Priorities list */}
            <div className="space-y-2">
              {priorities.map((item) => (
                <div key={item.id} className="p-3 border border-white/[0.05] bg-slate-950/40 rounded-xl flex flex-col gap-1.5 hover:border-cyan-500/20 transition-colors">
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>{item.id} // DIRECTIVE</span>
                    <span className={`${item.color} font-bold`}>{item.val}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-200 tracking-tight">{item.title}</h4>
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.confidence}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-cyan-400" 
                    />
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                    <span>SECTOR STABILITY</span>
                    <span>{item.confidence}% CONFIDENCE</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Dispatch CTA */}
            <div className="mt-auto pt-3 border-t border-white/[0.04] space-y-2">
              <button
                onClick={handleBeginShift}
                className="w-full py-4 bg-cyan-600 border border-cyan-400/20 text-slate-950 font-mono text-xs font-bold uppercase rounded-xl hover:bg-cyan-500 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>🚀 Launch Live Demo</span>
                <ArrowRight className="size-4 text-slate-950" />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full py-3 bg-slate-950/80 hover:bg-slate-900 border border-white/[0.08] text-slate-350 font-mono text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Volunteer Login</span>
              </button>
            </div>

          </div>
        </motion.section>

      </main>

      {/* Scrolling Ticker (Height: 8) */}
      <footer className="h-8 shrink-0 bg-slate-950/80 border-t border-white/[0.06] flex items-center overflow-hidden z-10 relative">
        <div className="absolute left-0 px-3 py-1 bg-cyan-600 text-slate-950 font-mono text-[9px] font-extrabold tracking-wider uppercase z-20 shadow-md">
          Live feed
        </div>
        
        <div className="flex-1 w-full overflow-hidden relative">
          <motion.div
            animate={{ x: ["5%", "-95%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            className="inline-block whitespace-nowrap text-[10px] font-mono tracking-widest text-cyan-400 font-bold"
          >
            AEGIS SYSTEM INITIALIZED   •   CHANNELS SECURE   •   GRID STABILITY NOMINAL   •   PRE-SHIFT STADIUM SWEEP COMPLETED   •   KICKOFF TELEMETRY ARMED
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

