"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Clock, Compass, AlertCircle, RefreshCw, CloudSun } from "lucide-react"

interface DashboardHeaderProps {
  volunteer: { name: string; role?: string }
  match: { match: string; venue: string }
  incidents: Array<{
    id?: string
    response: {
      severity: "critical" | "high" | "medium" | "low"
      incidentType: string
    }
    incident: string
  }>
  isDemoMode?: boolean
}

export function DashboardHeader({ volunteer, match, incidents, isDemoMode }: DashboardHeaderProps) {
  const [time, setTime] = useState("")
  const [lastSync, setLastSync] = useState("")
  const [opIdx, setOpIdx] = useState(0)

  // Rotating operations monitor modes
  const operations = [
    "Crowd Monitoring",
    "Transport Monitoring",
    "Medical Response",
    "Predictive Analysis"
  ]

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    // Set initial sync time
    const syncTime = new Date()
    syncTime.setSeconds(syncTime.getSeconds() - 12)
    setLastSync(syncTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))

    // Active operations mode cycler (every 5 seconds)
    const opTimer = setInterval(() => {
      setOpIdx((prev) => (prev + 1) % operations.length)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(opTimer)
    }
  }, [])

  // Emergency Level calculation based on live incident severity
  const getEmergencyLevel = () => {
    if (incidents.length === 0) {
      return { 
        label: "GREEN / NORMAL", 
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.15)]" 
      }
    }
    const hasCritical = incidents.some(inc => inc.response.severity === "critical")
    if (hasCritical) {
      return { 
        label: "RED / CRITICAL", 
        color: "text-rose-400 border-rose-500/40 bg-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse font-black" 
      }
    }
    const hasHigh = incidents.some(inc => inc.response.severity === "high")
    if (hasHigh) {
      return { 
        label: "ORANGE / WARNING", 
        color: "text-orange-400 border-orange-500/40 bg-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.25)]" 
      }
    }
    return { 
      label: "YELLOW / ADVISORY", 
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]" 
    }
  }

  const currentEmergency = getEmergencyLevel()

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md z-20 relative select-none"
    >
      {/* LEFT SECTION: FIFA World Cup branding & Match stats */}
      <div className="flex items-center gap-4">
        {/* World Cup 2026 Logo Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center p-1.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]">
            <Compass className="size-4 animate-spin-slow" />
          </div>
          <div>
            <span className="block text-[8px] font-mono tracking-widest text-slate-500 font-extrabold uppercase">
              FIFA WORLD CUP 2026
            </span>
            <span className="block text-[11px] font-black text-white tracking-tight uppercase">
              AEGIS COMMAND BRIDGE
            </span>
          </div>
        </div>

        {/* Match details & Flag Emojis */}
        <div className="hidden md:flex flex-col border-l border-white/[0.08] pl-4 font-mono text-[9px] text-slate-400 leading-normal">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">MATCH STREAM</span>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-200">{match.match}</span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-400">{match.venue}</span>
          </div>
        </div>
      </div>

      {/* CENTER SECTION: Blinking Badge, Emergency Level, rotating Mode */}
      <div className="flex items-center gap-3">
        {/* Animated LIVE AI online status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/35 text-[9px] font-mono text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>LIVE AI ONLINE</span>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/35 text-[9px] font-mono text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)] shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>SIMULATED OFFLINE DEMO MODE</span>
          </div>
        )}

        {/* Emergency level badge */}
        <div className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded border tracking-wider transition-all duration-300 ${currentEmergency.color}`}>
          EMERGENCY LEVEL: {currentEmergency.label}
        </div>

        {/* Dynamic operations selector */}
        <div className="hidden lg:flex flex-col bg-slate-900/60 border border-white/[0.04] px-3 py-0.5 rounded-lg text-center font-mono text-[9px] w-36 overflow-hidden">
          <span className="text-[7px] text-slate-500 uppercase">ACTIVE PROTOCOL</span>
          <AnimatePresence mode="wait">
            <motion.span 
              key={opIdx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-cyan-400 font-bold block truncate"
            >
              {operations[opIdx].toUpperCase()}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SECTION: Weather parameters, user operator profile, and ticking second clock */}
      <div className="flex items-center gap-4 font-mono text-[9px]">
        
        {/* Weather parameters */}
        <div className="hidden xl:flex items-center gap-3 border-r border-white/[0.08] pr-4 text-slate-450">
          <CloudSun className="size-4 text-slate-400" />
          <div>
            <div className="flex gap-2 text-[8px]">
              <span>74°F</span>
              <span>•</span>
              <span>RAIN: 12%</span>
              <span>•</span>
              <span>WIND: 8mph</span>
            </div>
            <span className="block text-[6.5px] text-cyan-400 font-extrabold uppercase">AI: OPTIMAL INGRESS CONDITIONS</span>
          </div>
        </div>

        {/* Operator Profile */}
        <div className="flex flex-col items-end">
          <span className="text-[7.5px] text-slate-500 uppercase">OPERATOR COGNITIVE SHIFT</span>
          <span className="text-[10px] font-extrabold text-slate-205">{volunteer.name.toUpperCase()}</span>
        </div>

        {/* Ticking Clock parameters */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1 rounded border border-white/[0.05] shadow-lg relative">
          <div className="flex flex-col items-start leading-none pr-1 border-r border-white/[0.06]">
            <span className="text-[7px] text-slate-600 uppercase">LAST SYNC</span>
            <span className="text-[8px] text-slate-400 font-bold">{lastSync}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400">
            <Clock className="size-3 text-cyan-400 animate-pulse" />
            <span className="tracking-tight">{time || "00:00:00"}</span>
          </div>
          {/* Synchronized sync indicator icon */}
          <div className="absolute top-[-4px] right-[-4px] p-0.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-400 scale-[0.6] shadow-md animate-spin-slow">
            <RefreshCw className="size-3" />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
export default DashboardHeader
