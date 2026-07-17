"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { RecommendationItem } from "@/types/analysis"
import { Sparkles, Shield, BadgeAlert, ArrowUpRight } from "lucide-react"

interface ActionPanelProps {
  recommendations: RecommendationItem[]
}

const priorityConfig = {
  critical: "bg-rose-500/10 border-rose-500/20 text-rose-450",
  high: "bg-amber-500/10 border-amber-500/20 text-amber-450",
  optimal: "bg-emerald-500/10 border-emerald-500/20 text-emerald-450",
}

export function ActionPanel({ recommendations }: ActionPanelProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommended Operations Directive</h3>
        </div>
        <span className="text-[9px] font-mono text-slate-600">ACTION_PLANS</span>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            className="p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] space-y-3.5"
          >
            {/* Top Action Row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-slate-900 border border-white/[0.06] text-cyan-455 shrink-0 mt-0.5">
                  <Shield className="size-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 leading-snug">{rec.action}</h4>
              </div>
              <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border font-semibold shrink-0 ${
                priorityConfig[rec.priority] || priorityConfig.optimal
              }`}>
                {rec.priority}
              </span>
            </div>

            {/* Sub details: Trigger Reason & Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] leading-relaxed pt-3.5 border-t border-white/[0.03]">
              <div>
                <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase mb-0.5">Reasoning Trigger</span>
                <p className="text-slate-400 font-normal">{rec.reason}</p>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase mb-0.5">Expected Impact</span>
                <p className="text-emerald-450 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="size-3.5" />
                  {rec.expectedImpact}
                </p>
              </div>
            </div>

            {/* Certainty rating */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-550 pt-2.5 border-t border-white/[0.01]">
              <span>Decision Certainty</span>
              <span className="font-semibold text-slate-350">{rec.confidence}% Accuracy</span>
            </div>

          </div>
        ))}
      </div>
    </CardGlass>
  )
}
