"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { X, User, AlertCircle, Compass, HelpCircle } from "lucide-react"

interface GateCardProps {
  zoneId: string
  zoneName: string
  status: "Normal" | "Busy" | "Warning" | "Critical"
  recommendation: string
  volunteers: string[]
  incidentsCount: number
  suggestedAction: string
  crowdCount: number
  density: number
  entrySpeed: number
  predictedDensity10Min: number
  onClose: () => void
}

const statusBadgeColors = {
  Normal: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  Busy: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  Warning: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  Critical: "bg-rose-500/10 border-rose-500/20 text-rose-400",
}

export function GateCard({
  zoneId,
  zoneName,
  status,
  recommendation,
  volunteers,
  incidentsCount,
  suggestedAction,
  crowdCount,
  density,
  entrySpeed,
  predictedDensity10Min,
  onClose,
}: GateCardProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
            {zoneName} Operations
          </span>
          <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
            statusBadgeColors[status] || statusBadgeColors.Normal
          }`}>
            {status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Details list */}
      <div className="space-y-3.5 text-xs">
        
        {/* Open Incidents Count */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/[0.02] font-mono text-[10px]">
          <span className="text-slate-500">Active Incidents Logged</span>
          <span className={`font-bold ${incidentsCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
            {incidentsCount} Open {incidentsCount === 1 ? "Incident" : "Incidents"}
          </span>
        </div>

        {/* Live Telemetry Readings Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-900 border border-white/[0.02] font-mono text-[10px] text-center">
          <div>
            <span className="block text-slate-500 text-[8px] uppercase mb-0.5">pax Count</span>
            <span className="font-bold text-slate-200">{crowdCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[8px] uppercase mb-0.5">Density</span>
            <span className={`font-bold ${
              status === "Critical" ? "text-rose-400" : status === "Warning" ? "text-orange-400" : status === "Busy" ? "text-amber-500" : "text-emerald-400"
            }`}>
              {density}%
            </span>
          </div>
          <div>
            <span className="block text-slate-500 text-[8px] uppercase mb-0.5">Velocity</span>
            <span className="font-bold text-cyan-400">{entrySpeed} pax/s</span>
          </div>
        </div>

        {/* 10-Minute Congestion Prediction */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/[0.02] font-mono text-[10px]">
          <span className="text-slate-500 uppercase">10m Predicted Ingress</span>
          <span className={`font-bold ${
            predictedDensity10Min >= 90 ? "text-rose-400 animate-pulse" : predictedDensity10Min >= 75 ? "text-orange-450" : "text-slate-200"
          }`}>
            {predictedDensity10Min}% load
          </span>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-1">
          <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase flex items-center gap-1">
            <Compass className="size-3 text-cyan-405" />
            <span>Active Directives</span>
          </span>
          <p className="text-slate-300 bg-slate-900/30 p-2.5 rounded-lg border border-white/[0.01] leading-relaxed">
            {recommendation || "System parameters nominal. No active AI deployment dispatches."}
          </p>
        </div>

        {/* Suggested Action */}
        <div className="space-y-1">
          <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase flex items-center gap-1">
            <HelpCircle className="size-3 text-amber-500" />
            <span>Action guidelines</span>
          </span>
          <p className="text-slate-350 bg-slate-900/30 p-2.5 rounded-lg border border-white/[0.01] leading-relaxed">
            {suggestedAction || "Standard patrol guidelines apply. Maintain queue monitoring."}
          </p>
        </div>

        {/* Assigned Volunteers */}
        <div className="space-y-1.5 pt-3 border-t border-white/[0.03]">
          <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase">Assigned Volunteers</span>
          <div className="space-y-1.5">
            {volunteers.map((vol, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-white/[0.04] text-slate-300 font-mono text-[10px]"
              >
                <User className="size-3 text-slate-500 shrink-0" />
                <span className="truncate">{vol}</span>
              </div>
            ))}
            {volunteers.length === 0 && (
              <span className="text-[10px] text-slate-650 font-mono italic">No staff assigned to this sector.</span>
            )}
          </div>
        </div>

      </div>

    </CardGlass>
  )
}
export default GateCard
