"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { ShieldAlert, AlertTriangle, CloudRain, Clock, DoorOpen } from "lucide-react"

export function RiskPanel() {
  const risks = [
    {
      id: "risk-1",
      title: "Queue congestion Surge at Gate C",
      description: "East entrances density at 78% average occupancy capacity. Bottle-neck threshold is emerging.",
      severity: "warning" as const,
      icon: DoorOpen,
    },
    {
      id: "risk-2",
      title: "Incoming Precipitation",
      description: "65% precipitation likelihood. Rain arrival expected in T+15 minutes. Ingress paths may get slick.",
      severity: "warning" as const,
      icon: CloudRain,
    },
    {
      id: "risk-3",
      title: "Transit delay impact on East ingress",
      description: "Metro delay has increased to 8 minutes, causing larger arrival groups cluster batches.",
      severity: "error" as const,
      icon: Clock,
    },
  ]

  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04] mb-4">
        <ShieldAlert className="size-4 text-amber-500" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Classified Predicted Risks</h3>
      </div>

      {/* Risks checklist */}
      <div className="space-y-3">
        {risks.map((risk) => {
          const Icon = risk.icon
          const isError = risk.severity === "error"
          return (
            <div 
              key={risk.id}
              className="flex gap-3.5 p-3 rounded-lg border border-white/[0.02] bg-white/[0.01] text-xs leading-relaxed"
            >
              <div className={`p-2 rounded-lg shrink-0 w-max h-max border ${
                isError 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-455" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-455"
              }`}>
                <Icon className="size-4" />
              </div>
              <div className="space-y-1">
                <span className={`block font-bold ${isError ? "text-rose-400" : "text-amber-400"}`}>
                  {risk.title}
                </span>
                <p className="text-slate-400">{risk.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </CardGlass>
  )
}
