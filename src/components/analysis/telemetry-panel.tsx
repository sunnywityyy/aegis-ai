"use client"

import React, { useState, useEffect } from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { ShieldAlert, Compass, Activity, Clock, Zap } from "lucide-react"
import { motion } from "framer-motion"

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

  return <span>{displayValue}</span>
}

interface TelemetryPanelProps {
  overallProgress: number
  isComplete: boolean
  startedTime: Date | null
  estimatedCompletion: Date | null
  currentTime: Date | null
  currentObjective: string
  operationalHealth: string
  confidence: number
}

export function TelemetryPanel({
  overallProgress,
  isComplete,
  startedTime,
  estimatedCompletion,
  currentTime,
  currentObjective,
  operationalHealth,
  confidence,
}: TelemetryPanelProps) {
  // Date time format helper
  const formatTimeStr = (date: Date | null) => {
    if (!date) return "--:--:--.--"
    const formatted = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const ms = String(date.getMilliseconds()).padStart(3, "0").slice(0, 2)
    return `${formatted}.${ms}`
  }

  return (
    <CardGlass className="w-full h-full relative p-5 select-none bg-slate-950/40 rounded-xl hologram-glow hologram-glow-hover" hoverEffect={false}>
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-5">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live AI Telemetry</h3>
        </div>
        <span className="text-[9px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded animate-pulse">
          {isComplete ? "RESOLVED" : "ACTIVE_SCAN"}
        </span>
      </div>

      {/* Telemetry Variables Grid */}
      <div className="space-y-4 font-mono text-[11px] text-slate-400">
        
        {/* Current Objective */}
        <div>
          <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-1">Current Objective</span>
          <div className="text-slate-200 font-semibold bg-white/[0.01] border border-white/[0.03] px-3 py-2 rounded-lg flex items-center gap-2">
            <Compass className="size-3.5 text-cyan-400 animate-spin-slow" />
            <span className="truncate">{currentObjective}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Analysis Progress */}
          <div>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Overall Analysis</span>
            <span className="text-base font-extrabold text-slate-100 tracking-tight">
              <CountUp value={overallProgress} />%
            </span>
          </div>

          {/* AI Confidence */}
          <div>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">AI Confidence</span>
            <motion.span 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-base font-extrabold text-cyan-400 tracking-tight block"
            >
              <CountUp value={confidence} />%
            </motion.span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/[0.03] pt-4">
          {/* Operational Health */}
          <div>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Operational Health</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Zap className="size-3 fill-current" />
              {operationalHealth}
            </span>
          </div>

          {/* Running Clock */}
          <div>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Telemetry Time</span>
            <span className="text-xs font-semibold text-cyan-400/90 tracking-tight animate-pulse">
              {formatTimeStr(currentTime)}
            </span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t border-white/[0.03] pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-500 font-semibold uppercase">Analysis Started</span>
            <span className="text-slate-300 font-medium">{formatTimeStr(startedTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-500 font-semibold uppercase">Est. Completion</span>
            <span className="text-slate-300 font-medium">{formatTimeStr(estimatedCompletion)}</span>
          </div>
        </div>

      </div>
    </CardGlass>
  )
}
