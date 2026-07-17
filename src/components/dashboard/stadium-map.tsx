"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { StadiumZone } from "./zones/stadium-zone"

interface StadiumMapProps {
  activeZoneId: string | null
  onSelectZone: (id: string) => void
  zoneStatuses: Record<string, "Normal" | "Busy" | "Warning" | "Critical">
  gateTelemetry?: Record<string, { crowdCount: number; density: number; entrySpeed: number; predictedDensity10Min: number }>
}

export function StadiumMap({ activeZoneId, onSelectZone, zoneStatuses, gateTelemetry }: StadiumMapProps) {
  const [simulatedStatuses, setSimulatedStatuses] = useState<Record<string, "Normal" | "Busy" | "Warning" | "Critical">>(zoneStatuses)
  const [radarAngle, setRadarAngle] = useState(0)

  // Sync prop changes
  useEffect(() => {
    setSimulatedStatuses(zoneStatuses)
  }, [zoneStatuses])

  // requestAnimationFrame hook for smooth 60 FPS radar sweep rotation (6 seconds full rotation)
  useEffect(() => {
    let animFrame: number
    let startTime: number | null = null
    
    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const angle = (elapsed / 6000 * 360) % 360
      setRadarAngle(angle)
      animFrame = requestAnimationFrame(tick)
    }
    
    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  // Custom segment coordinate paths representing different quadrants of the MetLife stadium footprint
  const zonesConfig = [
    {
      id: "gate-a",
      name: "Gate A",
      pathD: "M 220 80 A 280 160 0 0 1 380 80 L 370 110 A 240 130 0 0 0 230 110 Z",
      labelX: 300,
      labelY: 70,
      angle: 0, // 12 o'clock
    },
    {
      id: "gate-b",
      name: "Gate B",
      pathD: "M 390 90 A 280 160 0 0 1 470 170 L 440 180 A 240 130 0 0 0 370 115 Z",
      labelX: 430,
      labelY: 120,
      angle: 45, // 1:30 o'clock
    },
    {
      id: "gate-c",
      name: "Gate C",
      pathD: "M 480 190 A 280 160 0 0 1 480 310 L 450 290 A 240 130 0 0 0 450 210 Z",
      labelX: 500,
      labelY: 250,
      angle: 90, // 3 o'clock
    },
    {
      id: "gate-d",
      name: "Gate D",
      pathD: "M 470 330 A 280 160 0 0 1 390 410 L 370 385 A 240 130 0 0 0 440 320 Z",
      labelX: 430,
      labelY: 380,
      angle: 135, // 4:30 o'clock
    },
    {
      id: "emergency",
      name: "Emergency",
      pathD: "M 380 420 A 280 160 0 0 1 220 420 L 230 390 A 240 130 0 0 0 370 390 Z",
      labelX: 300,
      labelY: 430,
      angle: 180, // 6 o'clock
    },
    {
      id: "medical",
      name: "Medical",
      pathD: "M 210 410 A 280 160 0 0 1 130 330 L 160 320 A 240 130 0 0 0 230 385 Z",
      labelX: 170,
      labelY: 380,
      angle: 225, // 7:30 o'clock
    },
    {
      id: "vip",
      name: "VIP Entrance",
      pathD: "M 120 310 A 280 160 0 0 1 120 190 L 150 210 A 240 130 0 0 0 150 290 Z",
      labelX: 100,
      labelY: 250,
      angle: 270, // 9 o'clock
    },
    {
      id: "metro",
      name: "Metro Hub",
      pathD: "M 130 170 A 280 160 0 0 1 210 90 L 230 115 A 240 130 0 0 0 160 180 Z",
      labelX: 170,
      labelY: 120,
      angle: 315, // 10:30 o'clock
    },
    {
      id: "parking",
      name: "Parking Area",
      pathD: "M 120 70 A 380 220 0 0 1 480 70 L 450 100 A 320 170 0 0 0 150 100 Z",
      labelX: 300,
      labelY: 25,
      angle: 0, // 12 o'clock outer
    },
  ]

  // Calculate relative angle distance
  const getAngleDiff = (a: number, b: number) => {
    const diff = Math.abs(a - b) % 360
    return diff > 180 ? 360 - diff : diff
  }

  // Calculate speed duration (dur) dynamically based on gate density parameter
  const getDuration = (gateId: string) => {
    if (!gateTelemetry) return "5.0s"
    const density = gateTelemetry[gateId]?.density || 30
    if (density >= 90) return "16.0s" // Critical congestion -> very slow movement
    if (density >= 75) return "10.0s" // Warning
    if (density >= 50) return "6.0s"  // Busy
    return "3.2s"                     // Normal -> fluid movement
  }

  // Dynamically configure flow speed (speed variable binds reactively to dur)
  const flows = [
    { id: "flow-metro-gatea", path: "M 170 120 C 180 85, 250 75, 300 70", color: "#22d3ee", speed: getDuration("gate-a") },
    { id: "flow-metro-gateb", path: "M 170 120 C 220 70, 360 80, 430 120", color: "#22d3ee", speed: getDuration("gate-b") },
    { id: "flow-metro-gatec", path: "M 170 120 C 220 80, 420 100, 500 250", color: "#22d3ee", speed: getDuration("gate-c") },
    { id: "flow-metro-gated", path: "M 170 120 C 220 150, 350 250, 430 380", color: "#22d3ee", speed: getDuration("gate-d") },
  ]

  // Find gate with highest congestion density to highlight
  const getHighestCongestionGate = () => {
    if (!gateTelemetry) return "gate-c"
    let maxId = "gate-c"
    let maxDensity = -1
    Object.entries(gateTelemetry).forEach(([id, data]) => {
      if (id === "emergency") return
      if (data.density > maxDensity) {
        maxDensity = data.density
        maxId = id
      }
    })
    return maxId
  }

  const highestCongestionId = getHighestCongestionGate()
  const highestZoneConfig = zonesConfig.find(z => z.id === highestCongestionId)

  return (
    <div className="w-full h-full relative select-none flex flex-col min-h-0">
      {/* Visual Overlay Tech Deco */}
      <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-500/40 select-none pointer-events-none">
        METLIFE_SYS_LOC: [40.8135° N, 74.0744° W]
      </div>
      <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-500/40 select-none pointer-events-none">
        RADAR_STATUS: ACTIVE
      </div>

      {/* SVG Canvas Map */}
      <div className="relative flex-1 w-full flex items-center justify-center border border-white/[0.05] bg-slate-950/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/10">
        {/* Glowing floating grid backing */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05),transparent_60%)] pointer-events-none" />

        <svg 
          viewBox="0 0 600 500" 
          className="w-full h-full text-slate-500/5 stroke-slate-500/10 fill-none"
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="radarSweepGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0.15)" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
            </linearGradient>
            <radialGradient id="stadiumCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </radialGradient>
          </defs>

          {/* Tech coordinates grid */}
          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3">
            <line x1="100" y1="0" x2="100" y2="500" />
            <line x1="200" y1="0" x2="200" y2="500" />
            <line x1="300" y1="0" x2="300" y2="500" />
            <line x1="400" y1="0" x2="400" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="0" y1="100" x2="600" y2="100" />
            <line x1="0" y1="200" x2="600" y2="200" />
            <line x1="0" y1="300" x2="600" y2="300" />
            <line x1="0" y1="400" x2="600" y2="400" />
          </g>

          {/* Animated radar sonar rings */}
          <motion.circle
            cx="300"
            cy="250"
            r="230"
            stroke="rgba(34, 211, 238, 0.1)"
            strokeWidth="0.75"
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.circle
            cx="300"
            cy="250"
            r="150"
            stroke="rgba(34, 211, 238, 0.08)"
            strokeWidth="0.5"
            animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />

          {/* Radar Sweep Animation */}
          <motion.g
            style={{ 
              originX: "300px", 
              originY: "250px",
              rotate: radarAngle
            }}
          >
            {/* The sweeping radar line */}
            <line 
              x1="300" 
              y1="250" 
              x2="300" 
              y2="10" 
              stroke="rgba(34, 211, 238, 0.35)" 
              strokeWidth="2.0" 
              style={{ filter: "drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))" }}
            />
            {/* Sweeping slice shadow */}
            <path 
              d="M 300 250 L 300 10 A 240 240 0 0 1 440 80 Z" 
              fill="url(#radarSweepGradient)" 
            />
          </motion.g>

          {/* Stadium Inner Field/Court breathing glow */}
          <motion.ellipse 
            cx="300" 
            cy="250" 
            rx="160" 
            ry="85" 
            stroke="rgba(34, 211, 238, 0.2)" 
            strokeWidth="1.5"
            animate={{ scale: [1.0, 1.02, 1.0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 5.0, ease: "easeInOut" }}
          />
          <ellipse cx="300" cy="250" rx="120" ry="60" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.5" />
          <rect x="240" y="210" width="120" height="80" rx="6" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="0.75" fill="url(#stadiumCenterGlow)" />
          
          {/* Inner Field markings */}
          <line x1="300" y1="210" x2="300" y2="290" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="0.5" />
          <circle cx="300" cy="250" r="15" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="0.5" />

          {/* Rendering Flow Paths and Spectator Particles */}
          {flows.map((flow) => (
            <g key={flow.id}>
              {/* Stationary Guide path */}
              <path
                d={flow.path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Flow Dashes */}
              <path
                d={flow.path}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.2"
                strokeDasharray="6 12"
                strokeLinecap="round"
                style={{
                  animation: "metroFlowAnimation 8s linear infinite"
                }}
                opacity="0.3"
              />
              {/* Animated Spectator Particle 1 - key updates force-remount duration shifts */}
              <circle r="2.5" fill="#22d3ee" style={{ filter: `drop-shadow(0 0 3px #22d3ee)` }}>
                <animateMotion key={flow.speed} dur={flow.speed} repeatCount="indefinite" path={flow.path} />
              </circle>
              {/* Animated Spectator Particle 2 */}
              <circle r="2" fill="#22d3ee" opacity="0.7" style={{ filter: `drop-shadow(0 0 2px #22d3ee)` }}>
                <animateMotion key={`${flow.speed}-b`} dur={flow.speed} begin="1.8s" repeatCount="indefinite" path={flow.path} />
              </circle>
            </g>
          ))}

          {/* Expanding Radar Rings for Critical and Warning Sectors */}
          {zonesConfig.map((zone) => {
            const status = simulatedStatuses[zone.id] || "Normal"
            if (status === "Critical" || status === "Warning") {
              const color = status === "Critical" ? "#ef4444" : "#f97316"
              return (
                <g key={`radar-ripple-${zone.id}`}>
                  {/* Expanding Ring 1 */}
                  <motion.circle
                    cx={zone.labelX}
                    cy={zone.labelY - 12}
                    r={6}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    animate={{ scale: [1, 4.5], opacity: [0.75, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  />
                </g>
              )
            }
            return null
          })}

          {/* Zones Render */}
          {zonesConfig.map((zone) => {
            const status = simulatedStatuses[zone.id] || "Normal"
            
            // Check if radar sweep angle aligns within 35 degrees of this gate's angle position
            const isIlluminated = getAngleDiff(radarAngle, zone.angle) < 35

            // Fetch live data parameters
            const telemetry = gateTelemetry ? gateTelemetry[zone.id] : undefined

            return (
              <StadiumZone
                key={zone.id}
                id={zone.id}
                name={zone.name}
                status={status}
                pathD={zone.pathD}
                labelX={zone.labelX}
                labelY={zone.labelY}
                crowdCount={telemetry?.crowdCount}
                density={telemetry?.density}
                entrySpeed={telemetry?.entrySpeed}
                isIlluminated={isIlluminated}
                onClick={onSelectZone}
                isActive={activeZoneId === zone.id}
              />
            )
          })}

          {/* AI Congestion targeting scope scope over the highest congestion gate */}
          {highestZoneConfig && (
            <g key={`ai-target-${highestCongestionId}`}>
              {/* Targeting circle */}
              <motion.circle
                cx={highestZoneConfig.labelX}
                cy={highestZoneConfig.labelY - 12}
                r={18}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="4 2"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
              {/* Crosshairs lines */}
              <line x1={highestZoneConfig.labelX - 24} y1={highestZoneConfig.labelY - 12} x2={highestZoneConfig.labelX - 16} y2={highestZoneConfig.labelY - 12} stroke="#ef4444" strokeWidth="1" />
              <line x1={highestZoneConfig.labelX + 16} y1={highestZoneConfig.labelY - 12} x2={highestZoneConfig.labelX + 24} y2={highestZoneConfig.labelY - 12} stroke="#ef4444" strokeWidth="1" />
              <line x1={highestZoneConfig.labelX} y1={highestZoneConfig.labelY - 24} x2={highestZoneConfig.labelX} y2={highestZoneConfig.labelY - 16} stroke="#ef4444" strokeWidth="1" />
              <line x1={highestZoneConfig.labelX} y1={highestZoneConfig.labelY - 8} x2={highestZoneConfig.labelX} y2={highestZoneConfig.labelY} stroke="#ef4444" strokeWidth="1" />
              <text x={highestZoneConfig.labelX} y={highestZoneConfig.labelY - 25} textAnchor="middle" className="font-mono text-[6px] fill-rose-400 font-bold tracking-wider animate-pulse">
                AI_CONGESTION_ALERT
              </text>
            </g>
          )}

        </svg>

        {/* CSS Keyframes injected locally */}
        <style jsx global>{`
          @keyframes metroFlowAnimation {
            from {
              stroke-dashoffset: 80;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
export default StadiumMap


