"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { CloudRain, Wind, Compass } from "lucide-react"

export function WeatherPanel() {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04] mb-4">
        <CloudRain className="size-4 text-cyan-405" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Meteorological Telemetry</h3>
      </div>

      <div className="space-y-4">
        {/* Status block */}
        <div className="p-3 rounded-lg border border-white/[0.02] bg-white/[0.01] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <CloudRain className="size-4 text-slate-500 shrink-0" />
            <div>
              <span className="block text-[8px] text-slate-500 font-semibold uppercase">Rain probability</span>
              <span className="text-amber-400 font-semibold">65% Precipitation</span>
            </div>
          </div>
          <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
            Rain expected
          </span>
        </div>

        {/* Info detail */}
        <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
          Rain forecast expected to start in T+15 minutes. Assist guests by pointing to local shelter areas and sector cover paths.
        </p>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/[0.03] text-[10px] font-mono text-slate-500 leading-relaxed">
          <div>
            <span className="block text-[8px] font-semibold uppercase mb-0.5">Wind Velocity</span>
            <span className="text-slate-200 font-semibold">14 km/h East</span>
          </div>
          <div>
            <span className="block text-[8px] font-semibold uppercase mb-0.5">Alert level</span>
            <span className="text-slate-200 font-semibold">CAUTION</span>
          </div>
        </div>
      </div>
    </CardGlass>
  )
}
export default WeatherPanel
