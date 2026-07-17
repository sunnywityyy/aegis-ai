"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Cpu, CpuIcon, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react"

interface AIOperationsPanelProps {
  recommendations: Array<{
    id?: string
    action?: string
    reason?: string
    priority?: string
    createdAt?: { seconds: number }
    impact?: string
    confidence?: number
  }>
}

interface GateTelemetry {
  crowdCount: number
  density: number
  entrySpeed: number
  predictedDensity10Min: number
}

function TypingText({ text, speed = 25 }: { text: string; speed?: number }) {
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

  return (
    <span className="whitespace-pre-line">
      {displayedText}
      <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-0.5 animate-pulse">|</span>
    </span>
  )
}

export function AIOperationsPanel({ recommendations }: AIOperationsPanelProps) {
  // AI Engine Confidence (Fluctuates between 92% and 97%)
  const [confidence, setConfidence] = useState(94)
  useEffect(() => {
    const timer = setInterval(() => {
      setConfidence((prev) => {
        const jitter = Math.floor(Math.random() * 3) - 1
        return Math.max(92, Math.min(97, prev + jitter))
      })
    }, 3400)
    return () => clearInterval(timer)
  }, [])

  // Latency Metrics
  const [latency, setLatency] = useState({ inference: 14, memory: 242, prediction: 45 })
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency((prev) => ({
        inference: Math.max(10, Math.min(22, prev.inference + Math.floor(Math.random() * 5) - 2)),
        memory: Math.max(235, Math.min(249, prev.memory + Math.floor(Math.random() * 3) - 1)),
        prediction: Math.max(38, Math.min(55, prev.prediction + Math.floor(Math.random() * 7) - 3)),
      }))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  // Shifting workload queue history (Workload graph points)
  const [workloadHistory, setWorkloadHistory] = useState([20, 35, 15, 45, 30, 25, 40, 35])
  useEffect(() => {
    const timer = setInterval(() => {
      setWorkloadHistory((prev) => {
        const next = [...prev.slice(1)]
        next.push(Math.floor(Math.random() * 35) + 12)
        return next
      })
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  const points = workloadHistory.map((val, idx) => `${idx * 16},${30 - val}`)
  const pathD = `M 0,${30 - workloadHistory[0]} L ${points.join(" ")}`
  const fillD = `${pathD} L 112,30 L 0,30 Z`

  // AI Active Status Ticker
  const statuses = ["Thinking...", "Predicting...", "Monitoring...", "Dispatching...", "Completed..."]
  const [statusIdx, setStatusIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statuses.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [])
  const currentStatus = statuses[statusIdx]

  // Live Typewriter Reasoning Queue
  const reasoningTexts = [
    "Analyzing Gate C...\n✓ Crowd velocity calculated\n✓ Metro arrivals synchronized\n✓ Rain model updated\n✓ Volunteer allocation optimized",
    "Evaluating Metro Surge...\n✓ Train ETA cross-checked\n✓ Passenger volume model compiled\n✓ High-density routing mapped\n✓ Congestion risk mitigated",
    "Monitoring VIP Sector...\n✓ Secure pathway scanned\n✓ Escort team status queried\n✓ Ingress sensor array validated\n✓ Alert thresholds normal",
  ]
  const [reasoningIdx, setReasoningIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setReasoningIdx((prev) => (prev + 1) % reasoningTexts.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Shifting operational timeline records
  const timelineEvents = [
    "Detected Metro arrival cluster",
    "Gate C density threshold warning",
    "Recommended volunteer reallocation to Gate C",
    "Staff dispatch validated",
    "Ingress congestion model recalculated",
    "Gate B status updated to Busy",
    "Ingress velocities stabilized",
    "Cross-checking regional rail delays",
  ]
  const [timeline, setTimeline] = useState<string[]>([
    "[00:10] AI network initialized",
    "[00:12] Sensor matrix sync: ok",
    "[00:14] Ingress models calculated",
  ])
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeline((prev) => {
        const next = [...prev]
        const now = new Date()
        const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
        const event = timelineEvents[Math.floor(Math.random() * timelineEvents.length)]
        next.push(`[${timeStr}] ${event}`)
        if (next.length > 4) {
          next.shift()
        }
        return next
      })
    }, 7500)
    return () => clearInterval(timer)
  }, [])

  // Enriched Recommendations fallback list to ensure high-density display
  const defaultRecs = [
    {
      id: "rec-1",
      action: "Deploy Spanish Priority Staff to Gate C",
      reason: "Bilingual assistance request spike detected via local mobile feedback loop.",
      priority: "HIGH",
      confidence: 96,
      impact: "Ingress load reduced by 15%",
    },
    {
      id: "rec-2",
      action: "Metro Transit Surge Warning",
      reason: "Next arrival cluster carries 1.2x expected load. Open extra line segments.",
      priority: "CRITICAL",
      confidence: 92,
      impact: "Queue congestion cleared in 6m",
    },
  ]

  const displayRecs = recommendations && recommendations.length > 0 ? recommendations : defaultRecs

  return (
    <div className="flex flex-col gap-3 h-full min-h-0 relative select-none">
      {/* Background drifting neural-network mesh nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <motion.circle cx="40" cy="80" r="1.5" fill="#22d3ee" animate={{ y: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} />
        <motion.circle cx="210" cy="110" r="2.0" fill="#22d3ee" animate={{ y: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }} />
        <motion.circle cx="70" cy="240" r="1.5" fill="#22d3ee" animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }} />
        <motion.circle cx="190" cy="290" r="2.5" fill="#22d3ee" animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut" }} />
        <line x1="40" y1="80" x2="210" y2="110" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="210" y1="110" x2="70" y2="240" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="70" y1="240" x2="190" y2="290" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-400 animate-pulse" />
          <h2 className="text-[11px] font-black tracking-widest font-mono text-slate-200 uppercase">AI OPERATION DECK</h2>
        </div>
        
        {/* Blinking Live AI Badge */}
        <div className="flex items-center gap-1 bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>LIVE AI</span>
        </div>
      </div>

      {/* Main Grid: circular confidence and workload chart */}
      <div className="grid grid-cols-2 gap-3 shrink-0 relative z-10">
        {/* Circular Confidence block */}
        <div className="flex items-center gap-3 bg-slate-950/50 p-2.5 rounded-xl border border-white/[0.04] hologram-glow">
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
                animate={{ strokeDashoffset: 106.8 * (1 - confidence / 100) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-[8px] font-mono font-black text-cyan-400">{confidence}%</span>
          </div>
          <div>
            <span className="block text-[7px] font-mono text-slate-500 uppercase">COGNITIVE</span>
            <span className="block text-[9px] font-mono font-bold text-slate-300">CONFIDENCE</span>
          </div>
        </div>

        {/* Workload chart block */}
        <div className="flex items-center justify-between bg-slate-950/50 p-2.5 rounded-xl border border-white/[0.04] hologram-glow">
          <div>
            <span className="block text-[7px] font-mono text-slate-500 uppercase">WORKLOAD</span>
            <span className="block text-[9px] font-mono font-bold text-slate-300">QUEUE FLUX</span>
          </div>
          {/* Workload chart SVG */}
          <svg viewBox="0 0 112 30" className="w-[72px] h-7 text-cyan-500 fill-none shrink-0 border border-white/[0.03] bg-slate-950/40 rounded px-1">
            <path d={fillD} fill="rgba(34, 211, 238, 0.06)" stroke="none" />
            <path d={pathD} stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Latency parameters block */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-2 rounded-lg border border-white/[0.02] text-center font-mono text-[9px] text-slate-400 shrink-0 relative z-10">
        <div>
          <span className="block text-[7px] text-slate-500 uppercase">INFERENCE</span>
          <span className="font-bold text-cyan-400 animate-pulse">{latency.inference}ms</span>
        </div>
        <div>
          <span className="block text-[7px] text-slate-500 uppercase">SYS MEMORY</span>
          <span className="font-bold text-slate-300">{latency.memory}MB</span>
        </div>
        <div>
          <span className="block text-[7px] text-slate-500 uppercase">PRED CYCLE</span>
          <span className="font-bold text-slate-305">{latency.prediction}ms</span>
        </div>
      </div>

      {/* Scrollable middle body containing stream, timeline and cards */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pr-1 relative z-10">
        
        {/* Real-time reasoning streams */}
        <div className="bg-slate-950/40 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden border border-white/[0.04] hologram-glow hologram-glow-hover shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase tracking-wider">LIVE COGNITIVE REASONING</span>
            <span className="text-[8px] font-mono text-slate-550 uppercase animate-pulse">{currentStatus}</span>
          </div>
          <div className="font-mono text-[9px] bg-slate-950/90 p-3 rounded border border-white/[0.02] text-slate-300 min-h-[96px] select-text">
            <TypingText key={reasoningIdx} text={reasoningTexts[reasoningIdx]} speed={18} />
          </div>
        </div>

        {/* Shifting timeline history list */}
        <div className="bg-slate-950/40 rounded-xl p-3 flex flex-col gap-1.5 border border-white/[0.04] hologram-glow shrink-0">
          <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">DECISION ENGINE TIMELINE</span>
          <div className="font-mono text-[9px] bg-slate-950/80 p-2.5 rounded border border-white/[0.02] space-y-1 text-slate-400">
            {timeline.map((event, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-cyan-500">{event.slice(0, 7)}</span>
                <span className="truncate">{event.slice(7)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Recommendations cards list */}
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">DISPATCH DIRECTIVES</span>
          <div className="space-y-2">
            <AnimatePresence>
              {displayRecs.slice(0, 3).map((rec, index) => (
                <motion.div 
                  key={rec.id || index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.1 }}
                  className="p-3 rounded-xl border border-white/[0.04] bg-slate-950/50 hover:border-cyan-500/20 transition-all hologram-glow hologram-glow-hover flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center font-mono text-[8px]">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">[{rec.priority || "HIGH"} PRIORITY]</span>
                    <span className="text-slate-500 font-semibold">{rec.confidence || 94}% CONF</span>
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-200 mt-0.5">{rec.action || "Active Dispatch"}</h4>
                  <p className="text-[9px] text-slate-450 leading-relaxed font-mono mt-0.5">{rec.reason || "System parameters nominal."}</p>
                  
                  {/* Expected impact telemetry tag */}
                  <div className="mt-1.5 flex items-center justify-between text-[7.5px] font-mono bg-cyan-950/20 border border-cyan-500/10 px-2 py-0.5 rounded text-cyan-400">
                    <span>EXPECTED IMPACT:</span>
                    <span className="font-extrabold">{rec.impact || "Nominal load redistribution"}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}
export default AIOperationsPanel
