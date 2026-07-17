"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { Sparkles, Accessibility, AlertTriangle, Languages } from "lucide-react"

interface PriorityItem {
  id: string
  title: string
  explanation: string
  confidence: number
  status: StatusType
  statusLabel: string
  icon: React.ReactNode
}

const priorities: PriorityItem[] = [
  {
    id: "MP-01",
    title: "Accessibility Route Ready",
    explanation: "Elevator at Zone B3 is verified operational, shuttle service active.",
    confidence: 98,
    status: "success",
    statusLabel: "Optimal",
    icon: <Accessibility className="size-4" />,
  },
  {
    id: "MP-02",
    title: "Gate 6 Congestion Predicted",
    explanation: "Expected surge at 18:30 due to Metro arrival, recommended flow redirection.",
    confidence: 84,
    status: "warning",
    statusLabel: "Surge Risk",
    icon: <AlertTriangle className="size-4" />,
  },
  {
    id: "MP-03",
    title: "Spanish-speaking Visitors Expected",
    explanation: "High volume of Spanish passport holders arriving, deployment of bilingual volunteers recommended.",
    confidence: 91,
    status: "error", // Using error status configuration for orange warning/alert indicator
    statusLabel: "Resource Alert",
    icon: <Languages className="size-4" />,
  },
]

export function MissionPriorities() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Mission Priorities</h3>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-white/[0.04] text-[10px] font-mono text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-4">
        {priorities.map((item) => (
          <CardGlass key={item.id} className="relative group/priority" hoverEffect={true}>
            {/* Left border-stripe indicator for priority severity */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                item.status === "success" 
                  ? "bg-emerald-500" 
                  : item.status === "warning" 
                  ? "bg-amber-500" 
                  : "bg-rose-500"
              }`} 
            />
            
            <div className="flex flex-col gap-2 pl-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded bg-white/[0.02] border border-white/[0.04] ${
                    item.status === "success" 
                      ? "text-emerald-400" 
                      : item.status === "warning" 
                      ? "text-amber-400" 
                      : "text-rose-400"
                  }`}>
                    {item.icon}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                </div>
                <StatusBadge status={item.status} label={item.statusLabel} pulse={item.status !== "success"} />
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {item.explanation}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.03] mt-1 text-[11px]">
                <span className="font-mono text-slate-500">{item.id}</span>
                <div className="flex items-center gap-1 text-cyan-400/90 font-medium font-mono">
                  <Sparkles className="size-3" />
                  <span>{item.confidence}% AI Confidence</span>
                </div>
              </div>
            </div>
          </CardGlass>
        ))}
      </div>
    </div>
  )
}
