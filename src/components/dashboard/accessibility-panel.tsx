"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { Accessibility, AlertTriangle, ShieldCheck } from "lucide-react"

export function AccessibilityPanel() {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04] mb-4">
        <Accessibility className="size-4 text-cyan-405" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accessibility Alerts</h3>
      </div>

      <div className="space-y-4">
        {/* Status block */}
        <div className="p-3 rounded-lg border border-white/[0.02] bg-white/[0.01] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 text-slate-500 shrink-0" />
            <div>
              <span className="block text-[8px] text-slate-500 font-semibold uppercase">Elevator Incident</span>
              <span className="text-rose-400 font-semibold">Sector 110 Offline</span>
            </div>
          </div>
          <span className="text-[9px] font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase">
            Maintenance
          </span>
        </div>

        {/* Info detail */}
        <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
          Elevator offline due to minor mechanical failure. Re-route accessibility guests to adjacent sector elevator shafts at Section 112.
        </p>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/[0.03] text-[10px] font-mono text-slate-500 leading-relaxed">
          <div>
            <span className="block text-[8px] font-semibold uppercase mb-0.5">Assigned support</span>
            <span className="text-slate-200 font-semibold">2 Volunteers</span>
          </div>
          <div>
            <span className="block text-[8px] font-semibold uppercase mb-0.5">Escort queues</span>
            <span className="text-emerald-450 font-semibold">NOMINAL</span>
          </div>
        </div>
      </div>
    </CardGlass>
  )
}
export default AccessibilityPanel
