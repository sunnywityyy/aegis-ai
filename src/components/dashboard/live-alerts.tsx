"use client"

import React, { useState } from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { IncidentLogDocument } from "@/types/firestore"
import { AlertTriangle, ShieldCheck, Clock, Loader2 } from "lucide-react"

interface LiveAlertsProps {
  incidents: IncidentLogDocument[]
  onResolve: (id: string) => void
}

const severityConfig = {
  critical: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  high: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  medium: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  low: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
}

export function LiveAlerts({ incidents, onResolve }: LiveAlertsProps) {
  // Track resolving document IDs locally
  const [resolvingMap, setResolvingMap] = useState<Record<string, boolean>>({})

  const handleResolveClick = async (id: string) => {
    setResolvingMap((prev) => ({ ...prev, [id]: true }))
    try {
      await onResolve(id)
    } catch (error) {
      console.error("Alert resolution error:", error)
    } finally {
      setResolvingMap((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none animate-pulse-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-rose-500 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Incident Alerts</h3>
        </div>
        <span className="text-[9px] font-mono text-slate-650">UNRESOLVED_LOGS ({incidents.length})</span>
      </div>

      {/* Alert list */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {incidents.map((inc) => {
          const isResolving = !!resolvingMap[inc.id || ""]
          
          return (
            <div 
              key={inc.id}
              className="p-3.5 rounded-xl border border-white/[0.02] bg-slate-900/20 flex flex-col justify-between gap-3 text-xs leading-relaxed"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${
                      severityConfig[inc.response.severity] || severityConfig.medium
                    }`}>
                      {inc.response.severity}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-200">{inc.response.incidentType}</span>
                  </div>
                  <p className="text-slate-400 font-normal leading-relaxed">{inc.incident}</p>
                </div>
              </div>

              {/* suggested actions checklist */}
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/[0.02] text-[11px] text-slate-450 space-y-1">
                <span className="block font-mono text-[8px] text-slate-500 font-semibold uppercase">Immediate Steps:</span>
                <ul className="space-y-1">
                  {inc.response.immediateActions.slice(0, 2).map((action, i) => (
                    <li key={i} className="flex items-center gap-1.5 font-mono">
                      <span className="h-1 w-1 bg-cyan-400 rounded-full shrink-0" />
                      <span className="truncate">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action footer */}
              <div className="flex items-center justify-between border-t border-white/[0.02] pt-2 mt-1">
                <span className="text-[9px] font-mono text-slate-600 flex items-center gap-1">
                  <Clock className="size-3" />
                  {inc.latency} ms lag
                </span>
                
                <button
                  onClick={() => handleResolveClick(inc.id || "")}
                  disabled={isResolving}
                  className="px-3 py-1 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-semibold uppercase rounded hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:translate-y-px"
                >
                  {isResolving ? (
                    <Loader2 className="size-2.5 animate-spin text-emerald-400" />
                  ) : (
                    <ShieldCheck className="size-3" />
                  )}
                  <span>Resolve</span>
                </button>
              </div>

            </div>
          )
        })}

        {incidents.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-650 font-mono italic">
            No active incidents. Status nominal.
          </div>
        )}
      </div>
    </CardGlass>
  )
}
export default LiveAlerts
