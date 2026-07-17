"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface StadiumZoneProps {
  id: string
  name: string
  status: "Normal" | "Busy" | "Warning" | "Critical"
  pathD: string // SVG path path string
  labelX: number
  labelY: number
  crowdCount?: number
  density?: number
  entrySpeed?: number
  isIlluminated?: boolean
  onClick: (id: string) => void
  isActive: boolean
}

const statusColors = {
  Normal: {
    fill: "rgba(16, 185, 129, 0.1)",
    hoverFill: "rgba(16, 185, 129, 0.25)",
    stroke: "rgba(16, 185, 129, 0.4)",
    glow: "#10b981",
    shadow: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))",
  },
  Busy: {
    fill: "rgba(245, 158, 11, 0.1)",
    hoverFill: "rgba(245, 158, 11, 0.25)",
    stroke: "rgba(245, 158, 11, 0.4)",
    glow: "#f59e0b",
    shadow: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))",
  },
  Warning: {
    fill: "rgba(249, 115, 22, 0.12)",
    hoverFill: "rgba(249, 115, 22, 0.28)",
    stroke: "rgba(249, 115, 22, 0.5)",
    glow: "#f97316",
    shadow: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.7))",
  },
  Critical: {
    fill: "rgba(239, 68, 68, 0.15)",
    hoverFill: "rgba(239, 68, 68, 0.35)",
    stroke: "rgba(239, 68, 68, 0.6)",
    glow: "#ef4444",
    shadow: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))",
  },
}

export function StadiumZone({
  id,
  name,
  status,
  pathD,
  labelX,
  labelY,
  crowdCount,
  density,
  entrySpeed,
  isIlluminated,
  onClick,
  isActive,
}: StadiumZoneProps) {
  const colors = statusColors[status] || statusColors.Normal
  const [isHovered, setIsHovered] = useState(false)

  // Fast pulse rate for Critical status, slower for Warning/Busy
  const pulseDuration = status === "Critical" ? 0.7 : status === "Warning" ? 1.3 : 2.0

  return (
    <motion.g 
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer select-none group"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Radar sweep illumination glow */}
      {isIlluminated && (
        <motion.path
          d={pathD}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          style={{ filter: "blur(4px)" }}
          transition={{ duration: 0.15 }}
        />
      )}

      {/* Glow path behind for active/critical states */}
      {(isActive || status === "Critical" || status === "Warning") && (
        <motion.path
          d={pathD}
          fill="none"
          stroke={colors.glow}
          strokeWidth="3"
          opacity="0.3"
          style={{ filter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 0.25 } : { opacity: [0.1, 0.4, 0.1] }}
          transition={isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: pulseDuration, ease: "easeInOut" }}
        />
      )}

      {/* SVG Path Hotspot */}
      <motion.path
        d={pathD}
        initial={{ fill: colors.fill, stroke: colors.stroke }}
        animate={{ 
          fill: isActive ? "rgba(6, 182, 212, 0.2)" : colors.fill, 
          stroke: isActive ? "#22d3ee" : colors.stroke,
          strokeWidth: isActive ? 2 : 1
        }}
        whileHover={{
          fill: isActive ? "rgba(6, 182, 212, 0.3)" : colors.hoverFill,
          stroke: isActive ? "#67e8f9" : colors.glow,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {/* Pulsing Status Dot indicator wrapper */}
      <g style={{ filter: colors.shadow }}>
        {/* Pulsing Ring for warning/critical/busy statuses */}
        {status !== "Normal" && (
          <motion.circle
            cx={labelX}
            cy={labelY - 12}
            r={10}
            fill="none"
            stroke={colors.glow}
            strokeWidth="1.5"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={isHovered ? { scale: 1.0, opacity: 0.5 } : { scale: 1.8, opacity: 0 }}
            transition={isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: pulseDuration, ease: "easeOut" }}
          />
        )}

        {/* Core status indicator circle */}
        <motion.circle
          cx={labelX}
          cy={labelY - 12}
          r={isActive ? 5.5 : 4}
          animate={{ 
            r: isActive ? 5.5 : 4,
            fill: isActive ? "#22d3ee" : colors.glow 
          }}
          transition={{ duration: 0.3 }}
        />
      </g>

      {/* Labeled Tag */}
      <motion.text
        x={labelX}
        y={labelY + 4}
        textAnchor="middle"
        className="font-mono text-[9px] font-extrabold tracking-wider"
        animate={{ 
          fill: isActive ? "#22d3ee" : "#94a3b8",
        }}
        whileHover={{ fill: "#f8fafc" }}
        transition={{ duration: 0.3 }}
        style={{
          textShadow: isActive ? "0 0 6px rgba(34, 211, 238, 0.6)" : "none",
        }}
      >
        {name.toUpperCase()}
      </motion.text>

      {/* Live telemetry statistics subtitle under the label */}
      {typeof crowdCount !== "undefined" && typeof density !== "undefined" && typeof entrySpeed !== "undefined" && (
        <text
          x={labelX}
          y={labelY + 13}
          textAnchor="middle"
          className="font-mono text-[7px] fill-slate-500 font-bold tracking-wider select-none pointer-events-none"
        >
          {crowdCount} | {density}% | {entrySpeed}p/s
        </text>
      )}

      {/* Detailed Live Tooltip overlay on hover */}
      <AnimatePresence>
        {isHovered && typeof crowdCount !== "undefined" && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none select-none"
          >
            {/* Background tooltip box */}
            <rect
              x={labelX - 45}
              y={labelY - 48}
              width="90"
              height="28"
              rx="4"
              fill="#020617"
              stroke="rgba(34, 211, 238, 0.3)"
              strokeWidth="0.75"
              opacity="0.95"
            />
            {/* Tooltip text */}
            <text x={labelX} y={labelY - 38} textAnchor="middle" className="font-mono text-[6px] fill-slate-400 font-semibold uppercase">
              SECTOR TELEMETRY
            </text>
            <text x={labelX} y={labelY - 30} textAnchor="middle" className="font-mono text-[7px] fill-cyan-400 font-black">
              {status} // {density}% CAP
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </motion.g>
  )
}
export default StadiumZone
