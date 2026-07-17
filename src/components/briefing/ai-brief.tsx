"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { Sparkles, Brain, Clock, ShieldAlert } from "lucide-react"

interface AIBriefProps {
  modelName: string
  latencyMs: number
  overallConfidence: number
}

export function AIBrief({ modelName, latencyMs, overallConfidence }: AIBriefProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-6 select-none" hoverEffect={false}>
      
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.04] mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Intelligence Parameters</h3>
        </div>
        <span className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-semibold uppercase">
          Cognitive Briefing
        </span>
      </div>

      {/* Main content body */}
      <div className="space-y-6">
        
        {/* Core Brief Summary */}
        <div className="space-y-1.5">
          <span className="block text-[8px] font-mono text-slate-550 uppercase">Operational Directive Summary</span>
          <p className="text-xs text-slate-300 font-normal leading-relaxed">
            The Decision Engine evaluated live MetLife telemetry logs. Multiple queue bottlenecks and weather impacts were cross-referenced against volunteer deployment coordinates. Review the recommended actions block for active ingress dispatches.
          </p>
        </div>

        {/* Telemetry Index Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/[0.03] text-xs font-mono">
          
          {/* Engine model */}
          <div className="flex items-start gap-2.5">
            <Brain className="size-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">AI Engine Model</span>
              <span className="text-slate-200 font-semibold">{modelName}</span>
            </div>
          </div>

          {/* Latency */}
          <div className="flex items-start gap-2.5">
            <Clock className="size-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Decision Latency</span>
              <span className="text-slate-200 font-semibold">{latencyMs} ms</span>
            </div>
          </div>

        </div>

        {/* Accuracy Certainty Bar */}
        <div className="space-y-2 pt-4 border-t border-white/[0.03]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-450">Decision certainty threshold</span>
            <span className="text-cyan-405 font-bold">{overallConfidence}% Accuracy</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/[0.02]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500" 
              style={{ width: `${overallConfidence}%` }} 
            />
          </div>
        </div>

      </div>

    </CardGlass>
  )
}
