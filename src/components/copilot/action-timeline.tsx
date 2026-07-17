"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { IncidentLogDocument } from "@/types/firestore"
import { Clock, CheckCircle2, AlertCircle, MapPin } from "lucide-react"

interface ActionTimelineProps {
  logs: IncidentLogDocument[]
  onSelect: (log: IncidentLogDocument) => void
  activeLogId?: string
}

const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-rose-500",
  high:     "bg-amber-500",
  medium:   "bg-cyan-500",
  low:      "bg-emerald-500",
}

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-rose-400",
  high:     "text-amber-400",
  medium:   "text-cyan-400",
  low:      "text-emerald-400",
}

export function ActionTimeline({ logs, onSelect, activeLogId }: ActionTimelineProps) {

  const formatTime = (createdAt: any) => {
    if (!createdAt) return "--:--"
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  const truncate = (str: string, max: number) =>
    str?.length > max ? str.substring(0, max) + "…" : str || "—"

  return (
    <CardGlass
      className="w-full border border-white/[0.04] bg-slate-950/40"
      hoverEffect={false}
      innerClassName="flex flex-col p-0"
    >
      {/* ── Header ── */}
      <div className="px-4 py-2.5 border-b border-white/[0.04] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="size-3 text-cyan-400" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Incident Registry</span>
        </div>
        <span className="text-[8px] font-mono text-slate-600">{logs.length} RECORDS</span>
      </div>

      {/* ── Table Header ── */}
      <div className="px-4 py-1.5 grid grid-cols-[64px_80px_110px_1fr_88px] gap-3 border-b border-white/[0.03] shrink-0">
        {["TIME", "PRIORITY", "STATUS", "LOCATION / INCIDENT", ""].map((h, i) => (
          <span key={i} className="text-[8px] font-mono font-bold uppercase text-slate-600">{h}</span>
        ))}
      </div>

      {/* ── Rows ── */}
      <div>
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[9px] font-mono text-slate-600 italic">
            No incidents logged in current shift.
          </div>
        ) : (
          logs.map((log) => {
            const isActive = activeLogId === log.id
            const isResolved = log.status === "resolved"
            const sevStyle = SEVERITY_TEXT[log.response?.severity] || "text-slate-400"
            const sevDot = SEVERITY_DOT[log.response?.severity] || "bg-slate-500"

            return (
              <button
                key={log.id}
                onClick={() => onSelect(log)}
                className={`w-full px-4 py-2 grid grid-cols-[64px_80px_110px_1fr_88px] gap-3 items-center text-left transition-all cursor-pointer border-b border-white/[0.02] last:border-0 hover:bg-slate-900/40 ${
                  isActive ? "bg-slate-900/60 border-l-2 border-l-cyan-500" : ""
                }`}
              >
                {/* Time */}
                <span className="text-[9px] font-mono text-slate-500">{formatTime(log.createdAt)}</span>

                {/* Priority */}
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${sevDot}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase ${sevStyle}`}>
                    {log.response?.severity || "—"}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1">
                  {isResolved ? (
                    <>
                      <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                      <span className="text-[9px] font-mono text-emerald-400">Resolved</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3 text-rose-400 shrink-0 animate-pulse" />
                      <span className="text-[9px] font-mono text-rose-400">Active</span>
                    </>
                  )}
                </div>

                {/* Location / Incident info for table row - IncidentLogDocument has no .location, use .incident text */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin className="size-2.5 text-slate-600 shrink-0" />
                    <span className="text-[8px] font-mono text-slate-500 truncate">{truncate(log.incident || "", 40)}</span>
                  </div>
                  <span className="text-[9px] font-sans text-slate-300 truncate block">{truncate(log.response?.incidentType || "", 42)}</span>
                </div>

                {/* Load button */}
                <div className={`text-[8px] font-mono font-bold uppercase text-right pr-1 transition-colors ${
                  isActive ? "text-cyan-400" : "text-slate-600 hover:text-slate-300"
                }`}>
                  {isActive ? "LOADED ▶" : "LOAD →"}
                </div>
              </button>
            )
          })
        )}
      </div>
    </CardGlass>
  )
}
