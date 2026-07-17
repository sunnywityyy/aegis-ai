"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { Train, Clock, ArrowRight } from "lucide-react"

export function TransportPanel() {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04] mb-4">
        <Train className="size-4 text-cyan-405" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transit Terminal Telemetry</h3>
      </div>

      <div className="space-y-4">
        {/* Transit status block */}
        <div className="p-3 rounded-lg border border-white/[0.02] bg-white/[0.01] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Clock className="size-4 text-slate-500 shrink-0" />
            <div>
              <span className="block text-[8px] text-slate-500 font-semibold uppercase">Metro Delay Range</span>
              <span className="text-rose-400 font-semibold">T+8 Minutes Delay</span>
            </div>
          </div>
          <span className="text-[9px] font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase">
            Surge Risk
          </span>
        </div>

        {/* Info detail */}
        <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
          Congestion reported near main transit ring hubs. Standard shuttle loop departures are set to STANDBY stagger schedules to absorb ingress flows.
        </p>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/[0.03] text-[10px] font-mono text-slate-500 leading-relaxed">
          <div>
            <span className="block text-[8px] font-semibold uppercase mb-0.5">Shuttle Frequency</span>
            <span className="text-slate-200 font-semibold">4 Min Intervals</span>
          </div>
          <div>
            <span className="block text-[8px] font-semibold uppercase mb-0.5">Stagger departure</span>
            <span className="text-emerald-450 font-semibold">ACTIVE</span>
          </div>
        </div>
      </div>
    </CardGlass>
  )
}
export default TransportPanel
