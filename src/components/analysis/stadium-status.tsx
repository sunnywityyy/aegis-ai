"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { DoorOpen, Train, HeartPulse, Shield, LucideIcon } from "lucide-react"

import { StadiumZoneStatus } from "@/types/analysis"

interface StadiumStatusProps {
  zones: StadiumZoneStatus[]
}

const iconMap: Record<StadiumZoneStatus["icon"], LucideIcon> = {
  gate: DoorOpen,
  train: Train,
  medical: HeartPulse,
  security: Shield,
}

export function StadiumStatus({ zones }: StadiumStatusProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Stadium Status</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-600">STAD_TELEMETRY</span>
      </div>

      {/* Dynamic List mapping zones */}
      <div className="space-y-3">
        {zones.map((zone) => {
          const Icon = iconMap[zone.icon] || Shield
          return (
            <div 
              key={zone.id}
              className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-slate-900 border border-white/[0.06] text-slate-400">
                  <Icon className="size-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-300">{zone.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-450 font-normal">{zone.status}</span>
                <StatusBadge 
                  status={zone.risk} 
                  label={zone.risk === "success" ? "Nominal" : zone.risk === "warning" ? "Caution" : zone.risk === "error" ? "Alert" : "Optimal"} 
                  pulse={zone.risk === "error" || zone.risk === "warning"} 
                />
              </div>
            </div>
          )
        })}
      </div>
    </CardGlass>
  )
}
