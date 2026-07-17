"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useDashboard } from "@/hooks/use-dashboard"
import { copilotService } from "@/services/copilot/copilot-service"
import { StadiumMap } from "@/components/dashboard/stadium-map"
import { GateCard } from "@/components/dashboard/gate-card"
import { AIOperationsPanel } from "@/components/dashboard/ai-operations-panel"
import { LiveTelemetryPanel } from "@/components/dashboard/live-telemetry-panel"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AIAssistantPanel } from "@/components/dashboard/ai-assistant-panel"
import { 
  Terminal, 
  RefreshCw, 
  CalendarCheck2, 
  MessageSquareCode, 
  Loader2, 
  Activity, 
  Users, 
  ShieldAlert, 
  Train, 
  Cpu, 
  Clock, 
  Sparkles, 
  Mic,
  CheckCircle,
  HelpCircle,
  Volume2
} from "lucide-react"

// TypingText helper
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

// CountUp helper
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

export default function DashboardPage() {
  const router = useRouter()
  const {
    volunteer,
    match,
    recommendations,
    incidents,
    loading,
    reRunning,
    rerunAssessment,
    isDemoMode,
    resolveIncident,
  } = useDashboard()

  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  interface GateTelemetry {
    crowdCount: number
    density: number
    entrySpeed: number
    predictedDensity10Min: number
  }

  const [gateTelemetry, setGateTelemetry] = useState<Record<string, GateTelemetry>>({
    "gate-a": { crowdCount: 420, density: 28, entrySpeed: 1.4, predictedDensity10Min: 32 },
    "gate-b": { crowdCount: 680, density: 45, entrySpeed: 1.1, predictedDensity10Min: 48 },
    "gate-c": { crowdCount: 2150, density: 78, entrySpeed: 0.6, predictedDensity10Min: 84 },
    "gate-d": { crowdCount: 510, density: 34, entrySpeed: 1.3, predictedDensity10Min: 36 },
    "emergency": { crowdCount: 0, density: 0, entrySpeed: 0.0, predictedDensity10Min: 0 },
    "medical": { crowdCount: 80, density: 15, entrySpeed: 2.2, predictedDensity10Min: 18 },
    "vip": { crowdCount: 310, density: 25, entrySpeed: 1.6, predictedDensity10Min: 27 },
    "metro": { crowdCount: 2950, density: 92, entrySpeed: 0.2, predictedDensity10Min: 96 },
    "parking": { crowdCount: 1650, density: 65, entrySpeed: 0.8, predictedDensity10Min: 72 },
  })

  // Telemetry fluctuation simulator running every 2.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGateTelemetry((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((gateId) => {
          if (gateId === "emergency") return
          const current = next[gateId]
          const countJitter = Math.floor(Math.random() * 51) - 20 // -20 to +30 pax fluctuation
          const newCount = Math.max(50, Math.min(3500, current.crowdCount + countJitter))
          const designCapacity = gateId === "metro" ? 3200 : gateId === "gate-c" ? 2800 : 1500
          const newDensity = Math.min(99, Math.max(5, Math.round((newCount / designCapacity) * 100)))
          const newSpeed = parseFloat(Math.max(0.1, Math.min(2.5, (100 - newDensity) / 50 + 0.2)).toFixed(1))
          const newPrediction = Math.min(99, Math.max(5, newDensity + Math.floor(Math.random() * 9) - 3))
          
          next[gateId] = {
            crowdCount: newCount,
            density: newDensity,
            entrySpeed: newSpeed,
            predictedDensity10Min: newPrediction
          }
        })
        return next
      })
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState("")
  const [mounted, setMounted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [inferenceTime, setInferenceTime] = useState(142)

  useEffect(() => {
    const timer = setInterval(() => {
      setInferenceTime((prev) => {
        const jitter = Math.floor(Math.random() * 9) - 4
        const nextVal = prev + jitter
        return Math.max(120, Math.min(180, nextVal))
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    setMounted(true)
    
    // Live Ticking Clock
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    // Dynamic AI Log Steps
    const rawLogs = [
      "Predicting crowd movement...",
      "Cross-checking transport delays...",
      "Reallocating volunteers...",
      "Weather confidence updated.",
      "Gate C congestion probability: 82%",
      "Analyzing gate ingress velocities...",
      "Monitoring crowd surge patterns...",
      "Integrating Metro delay telemetry...",
      "Evaluating safety thresholds...",
      "Refreshing cognitive decision logic..."
    ]
    
    const initialLogs: string[] = []
    const now = new Date()
    for (let i = 2; i >= 0; i--) {
      const timeStr = new Date(now.getTime() - i * 60000).toLocaleTimeString("en-US", { hour12: false })
      initialLogs.push(`[${timeStr}] SYS: ${rawLogs[Math.floor(Math.random() * rawLogs.length)]}`)
    }
    setLogs(initialLogs)

    const logTimer = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false })
      const newLine = `[${timeStr}] COG: ${rawLogs[Math.floor(Math.random() * rawLogs.length)]}`
      setLogs(prev => [newLine, ...prev.slice(0, 4)])
    }, 3200)

    return () => {
      clearInterval(timer)
      clearInterval(logTimer)
    }
  }, [])

  // Map raw dynamic states to specific stadium zones
  const getZoneStatuses = (): Record<string, "Normal" | "Busy" | "Warning" | "Critical"> => {
    const statuses: Record<string, "Normal" | "Busy" | "Warning" | "Critical"> = {}

    Object.keys(gateTelemetry).forEach((key) => {
      const density = gateTelemetry[key].density
      if (density >= 90) {
        statuses[key] = "Critical"
      } else if (density >= 75) {
        statuses[key] = "Warning"
      } else if (density >= 50) {
        statuses[key] = "Busy"
      } else {
        statuses[key] = "Normal"
      }
    })

    // Adjust zone colors reactively if active incidents occur
    incidents.forEach((inc) => {
      const type = inc.response.incidentType.toLowerCase()
      if (type.includes("congestion") || type.includes("blockage")) {
        statuses["gate-c"] = "Critical"
      } else if (type.includes("lost child") || type.includes("suspicious")) {
        statuses["vip"] = "Warning"
      } else if (type.includes("medical") || type.includes("distress")) {
        statuses["medical"] = "Critical"
      }
    })

    return statuses
  }

  const zoneStatuses = getZoneStatuses()

  // Dynamic selector for clicking zone circles/paths on the SVG Map
  const getZoneDetails = (zoneId: string) => {
    const status = zoneStatuses[zoneId] || "Normal"
    
    const configs: Record<string, {
      name: string
      recommendation: string
      volunteers: string[]
      suggestedAction: string
      incidentsCount: number
    }> = {
      "gate-a": {
        name: "Gate A (North Entrance)",
        recommendation: "Operations nominal. Flow velocity satisfies baseline.",
        volunteers: ["Marie-Laure", "Luc"],
        suggestedAction: "Maintain standard ingress queues checks.",
        incidentsCount: 0,
      },
      "gate-b": {
        name: "Gate B (Northeast Entrance)",
        recommendation: "Operational load within nominal metrics.",
        volunteers: ["Pierre"],
        suggestedAction: "Monitor crowd flows and shuttle bus loops.",
        incidentsCount: 0,
      },
      "gate-c": {
        name: "Gate C (East Entrance)",
        recommendation: "Deploy one volunteer to Gate C immediately. Scan queue velocities.",
        volunteers: volunteer ? [volunteer.name, "Aaditya"] : ["Aaditya"],
        suggestedAction: "Open lane 3 stanchions to distribute arrival congestion.",
        incidentsCount: incidents.filter((i) => i.incident.toLowerCase().includes("gate c") || i.incident.toLowerCase().includes("blockage")).length,
      },
      "gate-d": {
        name: "Gate D (Southeast Entrance)",
        recommendation: "Slight surge predicted. Coordinate with Gate C.",
        volunteers: ["Jin-Woo"],
        suggestedAction: "Guide passenger flows to East concourse paths.",
        incidentsCount: 0,
      },
      "emergency": {
        name: "Emergency Exit E-2",
        recommendation: "Access lanes cleared. Emergency readiness online.",
        volunteers: [],
        suggestedAction: "Keep exits clear of operational gear or vehicles.",
        incidentsCount: 0,
      },
      "medical": {
        name: "Medical Centre (South)",
        recommendation: "Personnel available. Station status nominal.",
        volunteers: ["Dr. Evelyn"],
        suggestedAction: "Maintain first aid standby checklists.",
        incidentsCount: incidents.filter((i) => i.incident.toLowerCase().includes("medical")).length,
      },
      "vip": {
        name: "VIP Entrance (West)",
        recommendation: "Security parameters active. Guest services ready.",
        volunteers: ["François", "Isabella"],
        suggestedAction: "Validate credentials barcodes at entrance gates.",
        incidentsCount: 0,
      },
      "metro": {
        name: "Metro Hub (Northwest)",
        recommendation: "Stagger shuttle departures. Coordinate Metro flow delays.",
        volunteers: ["Ravi"],
        suggestedAction: "Use megaphone dispatches to guide arriving groups.",
        incidentsCount: incidents.filter((i) => i.incident.toLowerCase().includes("metro") || i.incident.toLowerCase().includes("transit")).length,
      },
      "parking": {
        name: "Parking Lot P3 (North)",
        recommendation: "Vehicular flows dense. Coordinate crossing dispatches.",
        volunteers: ["Carlos"],
        suggestedAction: "Coordinate pedestrian dispatches across crossing paths.",
        incidentsCount: 0,
      },
    }

    return configs[zoneId] || {
      name: "Stadium Sector",
      recommendation: "General operations nominal.",
      volunteers: [],
      suggestedAction: "Perform standard patrols.",
      incidentsCount: 0,
    }
  }

  const handleResolveAlert = async (incidentId: string) => {
    await resolveIncident(incidentId)
  }

  const getEmergencyLevel = () => {
    if (incidents.length === 0) {
      return { 
        label: "EMERGENCY: SYSTEM NOMINAL", 
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
      }
    }
    const hasCritical = incidents.some(inc => inc.response.severity === "critical")
    if (hasCritical) {
      return { 
        label: "EMERGENCY: CRITICAL LEVEL RED", 
        color: "text-rose-400 border-rose-500/40 bg-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse" 
      }
    }
    const hasHigh = incidents.some(inc => inc.response.severity === "high")
    if (hasHigh) {
      return { 
        label: "EMERGENCY: WARNING LEVEL ORANGE", 
        color: "text-orange-400 border-orange-500/40 bg-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.25)]" 
      }
    }
    return { 
      label: "EMERGENCY: MODERATE ADVISORY", 
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
    }
  }

  if (loading || !volunteer || !match || !mounted) {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] text-slate-100 flex items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-cyan-400" />
            <span className="font-mono text-xs text-slate-400 tracking-wider">BOOTING COGNITIVE COMMAND SYSTEM...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const selectedZoneDetails = selectedZoneId ? getZoneDetails(selectedZoneId) : null
  const currentEmergency = getEmergencyLevel()

  // Generate marquee contents dynamically
  const marqueeItems = [
    `FIFA OPERATIONS STATUS: IN PROGRESS`,
    `MATCH: ${match.match.toUpperCase()}`,
    `SECTOR INTEGRITY: ${incidents.length > 0 ? "78%" : "98%"}`,
    `WEATHER PRECIPITATION: 65% (EXPECTED 15 MINS)`,
    `METRO SHUTTLE ROUTING: STAGGERED`,
    ...incidents.map(i => `ACTIVE ALERT: ${i.response.summary.toUpperCase()}`),
    ...recommendations.slice(0, 3).map(r => `DECISION: ${r.action.toUpperCase()}`)
  ].join("   •   ")

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col font-sans select-none overflow-hidden relative scanline-sweep noise-bg">
        {/* Soft Blue Ambient Lighting Spotlight */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none z-0" />

        {/* Grid and Neon glow backing */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.02),transparent_70%)] pointer-events-none z-0" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        
        <DashboardHeader volunteer={volunteer} match={match} incidents={incidents} isDemoMode={isDemoMode} />

        {/* Main Content Area (Responsive Flex/Grid heights) */}
        <main className="flex-1 min-h-0 flex gap-4 p-4 z-10">
          
          {/* Left Panel - Logistics & Telemetry (23% width) */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[23%] flex flex-col gap-3 min-h-0"
          >
            {/* Header Title */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-1.5 shrink-0">
              <Activity className="size-4 text-cyan-400" />
              <h2 className="text-xs font-extrabold tracking-widest font-mono text-slate-300 uppercase">LOGISTICS & TELEMETRY</h2>
            </div>

            <div className="flex-1 min-h-0">
              <LiveTelemetryPanel
                incidents={incidents}
                rerunAssessment={rerunAssessment}
                reRunning={reRunning}
              />
            </div>

            {/* Quick Navigation CTAs */}
            <div className="grid grid-cols-2 gap-2 shrink-0 pt-2 border-t border-white/[0.04]">
              <button
                onClick={() => router.push("/briefing")}
                className="py-2 bg-slate-900 hover:bg-slate-850 border border-white/[0.08] text-slate-350 font-mono text-[9px] font-bold uppercase rounded-lg hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CalendarCheck2 className="size-3" />
                <span>Briefing</span>
              </button>

              <button
                onClick={() => router.push("/copilot")}
                className="py-2 bg-cyan-600 border border-cyan-400/20 text-slate-950 font-mono text-[9px] font-bold uppercase rounded-lg hover:bg-cyan-500 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquareCode className="size-3 text-slate-950" />
                <span>Copilot</span>
              </button>
            </div>
          </motion.section>

          {/* Center Panel - Large SVG blueprint map (50% width) */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[50%] flex flex-col min-h-0 relative border border-white/[0.05] bg-slate-950/20 backdrop-blur-md rounded-2xl p-4"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] shrink-0 mb-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-extrabold tracking-widest font-mono text-slate-300 uppercase">
                  METLIFE BLUEPRINT HOTSPOTS
                </span>
              </div>
              <span className="text-[8px] font-mono text-slate-500 tracking-wider">CLICK SECTOR ZONE TO AUDIT</span>
            </div>

            <div className="flex-1 min-h-0 relative">
              <StadiumMap
                activeZoneId={selectedZoneId}
                onSelectZone={(zoneId) => {
                  setSelectedZoneId(zoneId)
                  const zoneDetails = getZoneDetails(zoneId)
                  const category = zoneId.startsWith("gate-") 
                    ? "Gate Congestion" 
                    : zoneId === "medical" 
                    ? "Medical Emergency" 
                    : zoneId === "metro"
                    ? "Transit Disruption"
                    : "General"
                  router.push(`/copilot?location=${encodeURIComponent(zoneDetails.name)}&category=${encodeURIComponent(category)}`)
                }}
                zoneStatuses={zoneStatuses}
                gateTelemetry={gateTelemetry}
              />

              {/* Floating Holographic Zone Details Overlay */}
              <AnimatePresence>
                {selectedZoneId && selectedZoneDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-4 right-4 left-4 max-w-sm ml-auto z-25"
                  >
                    <GateCard
                      zoneId={selectedZoneId}
                      zoneName={selectedZoneDetails.name}
                      status={zoneStatuses[selectedZoneId] || "Normal"}
                      recommendation={selectedZoneDetails.recommendation}
                      volunteers={selectedZoneDetails.volunteers}
                      incidentsCount={selectedZoneDetails.incidentsCount}
                      suggestedAction={selectedZoneDetails.suggestedAction}
                      crowdCount={gateTelemetry[selectedZoneId]?.crowdCount || 0}
                      density={gateTelemetry[selectedZoneId]?.density || 0}
                      entrySpeed={gateTelemetry[selectedZoneId]?.entrySpeed || 0}
                      predictedDensity10Min={gateTelemetry[selectedZoneId]?.predictedDensity10Min || 0}
                      onClose={() => setSelectedZoneId(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[27%] flex flex-col gap-3 min-h-0 relative"
          >
            {isAssistantOpen ? (
              <div className="flex-1 min-h-0">
                <AIAssistantPanel onClose={() => setIsAssistantOpen(false)} />
              </div>
            ) : (
              <>
                <AIOperationsPanel recommendations={recommendations} />
                
                {/* AI Volunteer Interpreter Trigger Widget */}
                <div className="border border-cyan-500/20 bg-cyan-950/10 rounded-xl p-3.5 shrink-0 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-cyan-400 animate-pulse" />
                    <div>
                      <span className="block text-[8px] font-mono text-slate-500 uppercase">Interpreter Module</span>
                      <span className="block text-[10px] font-bold text-slate-200">AI Volunteer Interpreter</span>
                      <span className="block text-[8px] font-mono text-slate-500">Auto-detect · 10+ languages</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAssistantOpen(true)}
                    className="px-3 py-2 bg-cyan-600 border border-cyan-400/20 text-slate-950 font-mono text-[9px] font-bold uppercase rounded-lg hover:bg-cyan-500 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mic className="size-3.5 text-slate-950" />
                    <span>Open</span>
                  </button>
                </div>
              </>
            )}
          </motion.section>

        </main>

        {/* Live event scrolling ticker (Height: 8) */}
        <footer className="h-8 shrink-0 bg-slate-950/80 border-t border-white/[0.06] flex items-center overflow-hidden z-10 select-none relative">
          <div className="absolute left-0 px-3 py-1 bg-cyan-600 text-slate-950 font-mono text-[9px] font-extrabold tracking-wider uppercase z-20 shadow-md">
            Live Stream
          </div>
          
          <div className="flex-1 w-full overflow-hidden relative">
            <motion.div
              animate={{ x: ["5%", "-95%"] }}
              transition={{ ease: "linear", duration: 35, repeat: Infinity }}
              className="inline-block whitespace-nowrap text-[10px] font-mono tracking-widest text-cyan-400 font-bold"
            >
              {marqueeItems}
            </motion.div>
          </div>
        </footer>

      </div>
    </ProtectedRoute>
  )
}
