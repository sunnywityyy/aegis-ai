"use client"

import React, { useState, useRef, useEffect } from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { Button } from "@/components/ui/button"
import {
  MapPin, AlertTriangle, FileText, Send, Loader2, Save, X
} from "lucide-react"

interface IncidentInputProps {
  onSubmit: (
    text: string,
    priority: "critical" | "high" | "medium" | "low",
    location: string,
    category: string
  ) => void
  loading: boolean
  prefillLocation?: string
  prefillCategory?: string
}

const PRIORITY_CONFIG = {
  critical: { label: "CRITICAL", sub: "Paramedics / Police", color: "text-rose-400 border-rose-500/30 bg-rose-950/20" },
  high:     { label: "HIGH",     sub: "Immediate Response",   color: "text-amber-400 border-amber-500/30 bg-amber-950/20" },
  medium:   { label: "MEDIUM",   sub: "Operational Response", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20" },
  low:      { label: "LOW",      sub: "General Logistics",    color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" },
}

export function IncidentInput({ onSubmit, loading, prefillLocation = "", prefillCategory = "" }: IncidentInputProps) {
  const [text, setText] = useState("")
  const [location, setLocation] = useState("")
  const [priority, setPriority] = useState<"critical" | "high" | "medium" | "low">("medium")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (prefillLocation) {
      setLocation(prefillLocation)
      if (!text) setText(`Incident reported at ${prefillLocation}: `)
    }
  }, [prefillLocation])

  // Auto-expand textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    adjustHeight()
    textarea.addEventListener("input", adjustHeight)
    return () => textarea.removeEventListener("input", adjustHeight)
  }, [text])

  const handleClear = () => {
    setText("")
    setLocation("")
    setPriority("medium")
  }

  const handleSubmit = () => {
    if (!text.trim() || !location.trim()) return
    onSubmit(text.trim(), priority, location.trim(), "General")
  }

  const canSubmit = !loading && !!text.trim() && !!location.trim()

  return (
    <CardGlass
      className="w-full border border-white/[0.04] bg-slate-950/40 select-none"
      hoverEffect={false}
      innerClassName="flex flex-col p-0"
    >
      {/* ── Panel Header ── */}
      <div className="px-4 py-3 border-b border-white/[0.05] shrink-0 bg-slate-950/20">
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Operator Workspace</span>
        <h2 className="text-[11px] font-black uppercase text-slate-200 mt-0.5">Incident Report</h2>
      </div>

      {/* ── Form Fields ── */}
      <div className="px-4 py-3 space-y-3">

        {/* Incident Location */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 font-bold uppercase">
            <MapPin className="size-3" />
            Incident Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. East Entrance Gate C, Section 115"
            disabled={loading}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-lg text-[11px] text-slate-200 px-3 py-2.5 focus:outline-none focus:border-cyan-500/25 transition-all font-mono placeholder:text-slate-600 disabled:opacity-50"
          />
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 font-bold uppercase">
            <AlertTriangle className="size-3" />
            Priority Level
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(PRIORITY_CONFIG) as Array<keyof typeof PRIORITY_CONFIG>).map((p) => {
              const cfg = PRIORITY_CONFIG[p]
              const isActive = priority === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => !loading && setPriority(p)}
                  disabled={loading}
                  className={`px-2.5 py-2 rounded-lg border text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
                    isActive
                      ? `${cfg.color} ring-1 ring-inset ring-white/10`
                      : "border-white/[0.05] bg-slate-900/30 text-slate-600 hover:border-white/10 hover:text-slate-400"
                  }`}
                >
                  <div className={`text-[9px] font-mono font-black ${isActive ? "" : "text-slate-500"}`}>{cfg.label}</div>
                  <div className={`text-[8px] font-mono ${isActive ? "opacity-80" : "text-slate-600"}`}>{cfg.sub}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Incident Description */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 font-bold uppercase">
            <FileText className="size-3" />
            Incident Description
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the incident in detail. Include observations, affected area, number of people involved..."
            disabled={loading}
            rows={7}
            className="w-full bg-slate-950/60 border border-white/[0.06] rounded-lg text-[11px] text-slate-100 placeholder:text-slate-600 p-3 focus:outline-none focus:border-cyan-500/25 transition-all resize-none leading-relaxed font-sans disabled:opacity-50 overflow-hidden"
          />
        </div>

      </div>

      {/* ── BOTTOM BUTTONS ── Always visible ── */}
      <div className="px-4 py-3 border-t border-white/[0.04] shrink-0 bg-slate-950/30 flex gap-2">
        {/* Clear */}
        <button
          type="button"
          onClick={handleClear}
          disabled={loading || (!text.trim() && !location)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900 border border-white/[0.06] text-slate-400 font-mono text-[9px] font-bold uppercase rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X className="size-3" />
          Clear
        </button>

        {/* Save Draft */}
        <button
          type="button"
          disabled={loading || !text.trim()}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900 border border-white/[0.06] text-slate-400 font-mono text-[9px] font-bold uppercase rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Draft saved locally"
        >
          <Save className="size-3" />
          Draft
        </button>

        {/* Generate AI Assessment — primary action */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-mono font-black uppercase rounded-lg border transition-all duration-300 ${
            canSubmit
              ? "bg-cyan-600 border-cyan-400/25 text-slate-950 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-950/30 active:translate-y-px cursor-pointer"
              : "bg-slate-900/40 border-white/[0.04] text-slate-600 cursor-not-allowed opacity-50"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="size-3.5" />
              <span>Generate AI Assessment</span>
            </>
          )}
        </button>
      </div>
    </CardGlass>
  )
}
