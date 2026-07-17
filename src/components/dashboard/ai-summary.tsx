"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { RecommendationDocument } from "@/types/firestore"
import { Sparkles, Activity, ShieldCheck } from "lucide-react"

interface AISummaryProps {
  recommendations: RecommendationDocument[]
  priority: "optimal" | "high" | "critical"
  healthScore: number
}

const priorityBadgeColors = {
  optimal: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  high: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  critical: "bg-rose-500/10 border-rose-500/20 text-rose-400",
}

export function AISummary({ recommendations, priority, healthScore }: AISummaryProps) {
  // Take top 3 recommendations
  const topRecommendations = recommendations.slice(0, 3)

  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-405 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Summary Directives</h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px]">
          <span className="text-slate-500">System Priority:</span>
          <span className={`uppercase font-bold border px-1.5 py-0.5 rounded ${
            priorityBadgeColors[priority] || priorityBadgeColors.optimal
          }`}>
            {priority}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Top Recommendations - Right Health Rating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recommendations list */}
        <div className="md:col-span-2 space-y-2">
          <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase mb-1">
            Top Operational Directives
          </span>
          <div className="space-y-2">
            {topRecommendations.map((rec) => (
              <div 
                key={rec.id}
                className="p-3 rounded-lg border border-white/[0.02] bg-white/[0.01] text-xs flex items-start gap-2.5 leading-relaxed"
              >
                <div className="p-1 rounded bg-slate-900 border border-white/[0.04] text-cyan-405 shrink-0 mt-0.5">
                  <ShieldCheck className="size-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{rec.action}</h4>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-mono">{rec.reason}</p>
                </div>
              </div>
            ))}
            {topRecommendations.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-600 font-mono italic">
                Awaiting cognitive operations check parameters...
              </div>
            )}
          </div>
        </div>

        {/* Stadium Health Index */}
        <div className="flex flex-col justify-center items-center text-center p-4 bg-slate-900/30 rounded-xl border border-white/[0.02] relative overflow-hidden">
          <Activity className="size-6 text-cyan-405 mb-2" />
          <span className="text-[8px] font-mono text-slate-500 font-semibold uppercase">Overall Stadium Health</span>
          <div className="text-3xl font-black text-slate-100 tracking-tighter mt-1 font-mono">
            {healthScore}%
          </div>
          <span className="text-[9px] font-mono text-slate-450 mt-1">NOMINAL RANGE</span>
          <div className="w-full bg-slate-950 h-1 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-cyan-550 transition-all duration-500" 
              style={{ width: `${healthScore}%` }} 
            />
          </div>
        </div>

      </div>

    </CardGlass>
  )
}
