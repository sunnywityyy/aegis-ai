"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  UserCheck, 
  HeartHandshake, 
  Train, 
  CloudSun,
  Zap,
  RefreshCw
} from "lucide-react"

interface IncidentData {
  id?: string
  response: {
    severity: "critical" | "high" | "medium" | "low"
    incidentType: string
  }
  incident: string
}

interface LiveTelemetryPanelProps {
  incidents: IncidentData[]
  rerunAssessment: () => void
  reRunning: boolean
}

function CountUp({ value, duration = 1.0 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let startTime: number | null = null
    const startValue = Math.max(0, value - 1500)
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

export function LiveTelemetryPanel({ incidents, rerunAssessment, reRunning }: LiveTelemetryPanelProps) {
  // Widget 1: Crowd Density Index variables
  const [density, setDensity] = useState(74)
  const [densityTrend, setDensityTrend] = useState<"up" | "down" | "flat">("flat")
  const [densityTime, setDensityTime] = useState("")

  useEffect(() => {
    setDensityTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
    const timer = setInterval(() => {
      setDensity((prev) => {
        const change = Math.floor(Math.random() * 5) - 2
        if (change > 0) setDensityTrend("up")
        else if (change < 0) setDensityTrend("down")
        else setDensityTrend("flat")
        setDensityTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
        return Math.max(50, Math.min(95, prev + change))
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Widget 2: Stadium Occupancy variables
  const [occupancy, setOccupancy] = useState(75340)
  useEffect(() => {
    const timer = setInterval(() => {
      setOccupancy((prev) => {
        const change = Math.floor(Math.random() * 81) - 30
        return Math.max(72000, Math.min(82500, prev + change))
      })
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  // Widget 3: Volunteer Deployments status
  const [deployments, setDeployments] = useState({ active: 14, break: 3, route: 4, responding: 3 })
  useEffect(() => {
    const timer = setInterval(() => {
      setDeployments((prev) => {
        const roll = Math.random()
        if (roll < 0.3) {
          return { ...prev, active: prev.active + 1, break: Math.max(1, prev.break - 1) }
        } else if (roll < 0.6) {
          return { ...prev, active: Math.max(10, prev.active - 1), break: prev.break + 1 }
        } else {
          return { ...prev, responding: Math.max(1, Math.min(6, prev.responding + (Math.random() > 0.5 ? 1 : -1))) }
        }
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Widget 4: Incident severity distributions
  const critCount = incidents.filter(i => i.response.severity === "critical").length
  const highCount = incidents.filter(i => i.response.severity === "high").length
  const medCount = incidents.filter(i => i.response.severity === "medium").length
  const lowCount = incidents.filter(i => i.response.severity === "low").length

  const totalIncidents = critCount + highCount + medCount + lowCount
  const total = Math.max(4, totalIncidents)
  const critPct = ((critCount || 0) / total) * 100 || 5
  const highPct = ((highCount || 0) / total) * 100 || 15
  const medPct = ((medCount || 1) / total) * 100 || 40
  const lowPct = ((lowCount || 2) / total) * 100 || 40

  // Widget 5: Medical Response Jitter
  const [respTime, setRespTime] = useState(2.4)
  useEffect(() => {
    const timer = setInterval(() => {
      setRespTime((prev) => parseFloat(Math.max(1.8, Math.min(3.2, prev + (Math.random() * 0.4 - 0.2))).toFixed(1)))
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // Widget 6: Transport Health & Parking variables
  const [parkingPct, setParkingPct] = useState(84)
  useEffect(() => {
    const timer = setInterval(() => {
      setParkingPct((prev) => Math.max(70, Math.min(98, prev + Math.floor(Math.random() * 3) - 1)))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Widget 7: Weather
  const [rainProb, setRainProb] = useState(12)
  useEffect(() => {
    const timer = setInterval(() => {
      setRainProb((prev) => Math.max(10, Math.min(25, prev + Math.floor(Math.random() * 3) - 1)))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col h-full min-h-0 relative select-none">
      
      {/* Scrollable Widgets Area */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-2.5 min-h-0">
        
        {/* Widget 1: Crowd Density Index */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Circular progress gauge */}
          <div className="relative size-10 flex items-center justify-center shrink-0">
            <svg className="size-full -rotate-90">
              <circle cx="20" cy="20" r="17" className="stroke-slate-900 fill-none" strokeWidth="2.5" />
              <motion.circle 
                cx="20" 
                cy="20" 
                r="17" 
                className="stroke-cyan-400 fill-none" 
                strokeWidth="2.5" 
                strokeDasharray="106.8"
                animate={{ strokeDashoffset: 106.8 * (1 - density / 100) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-[8px] font-mono font-black text-cyan-400">{density}%</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[7px] font-mono text-slate-500 uppercase">CROWD DENSITY</span>
              <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" title="LIVE FEED" />
            </div>
            <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase">METLIFE INDEX FLUX</span>
            <span className="block text-[6.5px] font-mono text-slate-600">UPDATED: {densityTime}</span>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex flex-col items-center">
          {densityTrend === "up" && <TrendingUp className="size-4 text-rose-400 animate-bounce" />}
          {densityTrend === "down" && <TrendingDown className="size-4 text-emerald-400 animate-bounce" />}
          {densityTrend === "flat" && <Minus className="size-4 text-slate-500" />}
          <span className="text-[6.5px] font-mono text-slate-500 uppercase">{densityTrend}</span>
        </div>
      </div>

      {/* Widget 2: Stadium Occupancy */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-slate-400" />
            <span className="text-[7.5px] font-mono text-slate-500 uppercase">OCCUPANCY LEVEL</span>
            <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <span className="text-[7px] font-mono text-slate-550">CAP: 82,500</span>
        </div>
        <div className="text-base font-mono font-black text-slate-100 tracking-tight flex items-baseline gap-1">
          <CountUp value={occupancy} />
          <span className="text-[8px] text-slate-500 font-normal">PAX</span>
        </div>
        {/* Progress Ring Bar */}
        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-white/[0.02] mt-1.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(occupancy / 82500) * 100}%` }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="h-full bg-cyan-400" 
          />
        </div>
      </div>

      {/* Widget 3: Volunteer Deployments */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-slate-400" />
            <span className="text-[7.5px] font-mono text-slate-500 uppercase">STAFF DEPLOYMENTS</span>
            <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <span className="text-[7.5px] font-mono text-cyan-400 font-extrabold">{deployments.active + deployments.responding} ACTIVE</span>
        </div>

        {/* 4 states layout */}
        <div className="grid grid-cols-4 gap-1.5 font-mono text-center text-[7.5px]">
          <div className="bg-slate-900/60 p-1 rounded border border-white/[0.02]">
            <span className="block text-slate-500">ACTIVE</span>
            <span className="font-extrabold text-slate-200">{deployments.active}</span>
          </div>
          <div className="bg-slate-900/60 p-1 rounded border border-white/[0.02]">
            <span className="block text-slate-500">BREAK</span>
            <span className="font-extrabold text-slate-405">{deployments.break}</span>
          </div>
          <div className="bg-slate-900/60 p-1 rounded border border-white/[0.02]">
            <span className="block text-slate-500">EN ROUTE</span>
            <span className="font-extrabold text-cyan-400">{deployments.route}</span>
          </div>
          <div className="bg-slate-900/60 p-1 rounded border border-white/[0.02]">
            <span className="block text-slate-550">RESPOND</span>
            <span className="font-extrabold text-rose-400 animate-pulse">{deployments.responding}</span>
          </div>
        </div>
      </div>

      {/* Widget 4: Incident Monitor */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-rose-455" />
            <span className="text-[7.5px] font-mono text-slate-550 uppercase">INCIDENT MONITOR</span>
            <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <span className="text-[8px] font-mono font-bold text-rose-400 uppercase">
            {totalIncidents > 0 ? `${totalIncidents} ACTIVE` : "SECURE"}
          </span>
        </div>

        {/* Stacked colored progress bar */}
        <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-slate-900 border border-white/[0.02] mb-2">
          <motion.div style={{ width: `${critPct}%` }} className="bg-rose-500 h-full" layout />
          <motion.div style={{ width: `${highPct}%` }} className="bg-orange-500 h-full" layout />
          <motion.div style={{ width: `${medPct}%` }} className="bg-amber-400 h-full" layout />
          <motion.div style={{ width: `${lowPct}%` }} className="bg-cyan-400 h-full" layout />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[7px] text-slate-500">
          <div><span className="inline-block w-1 h-1 bg-rose-500 rounded-full mr-0.5" />CRIT ({critCount})</div>
          <div><span className="inline-block w-1 h-1 bg-orange-500 rounded-full mr-0.5" />HIGH ({highCount})</div>
          <div><span className="inline-block w-1 h-1 bg-amber-400 rounded-full mr-0.5" />MED ({medCount})</div>
          <div><span className="inline-block w-1 h-1 bg-cyan-400 rounded-full mr-0.5" />LOW ({lowCount})</div>
        </div>
      </div>

      {/* Widget 5: Medical Readiness */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <HeartHandshake className="size-3.5 text-slate-400" />
          <span className="text-[7.5px] font-mono text-slate-500 uppercase">MEDICAL SECTOR READINESS</span>
          <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-[8px] text-slate-400">
          <div className="bg-slate-900/50 p-1.5 rounded border border-white/[0.02]">
            <span className="block text-[6.5px] text-slate-500 uppercase">TEAMS ONLINE</span>
            <span className="font-extrabold text-slate-200">4 DEPLOYED</span>
          </div>
          <div className="bg-slate-900/50 p-1.5 rounded border border-white/[0.02]">
            <span className="block text-[6.5px] text-slate-500 uppercase">AVG RESP TIME</span>
            <span className="font-extrabold text-cyan-400">{respTime} MINS</span>
          </div>
        </div>
        <div className="mt-1.5 font-mono text-[7px] text-slate-500 bg-slate-900/40 p-1 rounded border border-white/[0.02] truncate">
          NEAREST FIELD STATION: <span className="font-bold text-slate-350">SECTOR E-4 (GATE C)</span>
        </div>
      </div>

      {/* Widget 6: Transport Health */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <Train className="size-3.5 text-slate-400" />
          <span className="text-[7.5px] font-mono text-slate-550 uppercase">TRANSIT & LOGISTICS DECK</span>
          <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
        </div>

        <div className="space-y-1.5 font-mono text-[8px]">
          {/* Metro */}
          <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded border border-white/[0.02]">
            <span className="text-slate-400">METRO MAIN LINE</span>
            <span className="text-rose-400 font-extrabold flex items-center gap-0.5">
              +8m delay <TrendingUp className="size-2" />
            </span>
          </div>
          {/* Parking */}
          <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded border border-white/[0.02]">
            <span className="text-slate-400">PARKING LOT P3</span>
            <span className="text-cyan-400 font-extrabold">{parkingPct}% load</span>
          </div>
        </div>
      </div>

      {/* Widget 7: Weather */}
      <div className="bg-slate-950/50 rounded-xl p-3 border border-white/[0.04] hologram-glow shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <CloudSun className="size-3.5 text-slate-400" />
          <span className="text-[7.5px] font-mono text-slate-550 uppercase">METLIFE ATMOSPHERICS</span>
          <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-3 gap-1 text-center font-mono text-[8px] text-slate-400">
          <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
            <span className="block text-[6.5px] text-slate-500 uppercase">TEMP</span>
            <span className="font-extrabold text-slate-205">74°F</span>
          </div>
          <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
            <span className="block text-[6.5px] text-slate-500 uppercase">RAIN</span>
            <span className="font-extrabold text-cyan-400">{rainProb}%</span>
          </div>
          <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
            <span className="block text-[6.5px] text-slate-500 uppercase">WIND</span>
            <span className="font-extrabold text-slate-300">8 mph</span>
          </div>
        </div>
        <div className="mt-1.5 font-mono text-[7px] text-slate-400 bg-cyan-950/20 border border-cyan-500/10 p-1 rounded text-cyan-400 leading-normal select-text">
          <span className="font-bold">AI_MODEL:</span> Normal ingress clearance expected; no rain blockage thresholds triggered.
        </div>
      </div>
      </div>
      
      {/* System trigger CTA Actions */}
      <div className="mt-auto pt-2 border-t border-white/[0.04] shrink-0">
        <button
          onClick={rerunAssessment}
          disabled={reRunning}
          className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-white/[0.08] text-slate-300 font-mono text-[9px] font-bold uppercase rounded-lg hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {reRunning ? (
            <>
              <Zap className="size-3 text-cyan-400 animate-bounce" />
              <span>Synthesizing Models...</span>
            </>
          ) : (
            <>
              <RefreshCw className="size-3 text-cyan-455 animate-spin-slow" />
              <span>Assessment Deck Re-Run</span>
            </>
          )}
        </button>
      </div>

    </div>
  )
}
export default LiveTelemetryPanel
