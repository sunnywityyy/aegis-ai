"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2, Circle } from "lucide-react"

import { TimelineEvent } from "@/types/analysis"

interface OperationsTimelineProps {
  events: TimelineEvent[]
  activeStep: number
  timestamps: string[]
  statuses: ("queued" | "analyzing" | "completed")[]
}

export function OperationsTimeline({
  events,
  activeStep,
  timestamps,
  statuses,
}: OperationsTimelineProps) {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Live AI Operations Timeline</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
      </div>

      <div className="relative border-l border-white/[0.04] pl-4 ml-2.5 space-y-5 py-2">
        {events.map((event, idx) => {
          const status = statuses[idx]
          const isCompleted = status === "completed"
          const isAnalyzing = status === "analyzing"
          const isQueued = status === "queued"
          const timestamp = timestamps[idx] || "--:--:--"

          return (
            <div 
              key={event.id}
              className={`relative flex items-start gap-4 transition-all duration-300 ${
                isCompleted 
                  ? "opacity-80" 
                  : isAnalyzing 
                  ? "opacity-100" 
                  : "opacity-30"
              }`}
            >
              {/* Left Timeline Node Indicator */}
              <div className="absolute -left-[22.5px] top-1 flex items-center justify-center">
                <div 
                  className={`size-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isCompleted 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : isAnalyzing
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-slate-950 border-white/[0.08] text-slate-700"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-2.5 stroke-[3]" />
                  ) : isAnalyzing ? (
                    <Loader2 className="size-2.5 animate-spin" />
                  ) : (
                    <Circle className="size-1 fill-current stroke-none" />
                  )}
                </div>
              </div>

              {/* Event Content Row */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span 
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isAnalyzing ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {event.label}
                </span>

                <div className="flex items-center gap-2">
                  {/* Millisecond Monospaced Time */}
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-950/40 px-2 py-0.5 rounded border border-white/[0.02]">
                    {timestamp}
                  </span>
                  
                  {/* Scan Badge */}
                  {isAnalyzing && (
                    <span className="text-[9px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded animate-pulse">
                      SCANNING
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                      OK
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
