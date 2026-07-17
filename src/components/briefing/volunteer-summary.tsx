"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { VolunteerDocument } from "@/types/firestore"
import { Shield, UserCheck, Languages } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

interface VolunteerSummaryProps {
  volunteer: VolunteerDocument
}

export function VolunteerSummary({ volunteer }: VolunteerSummaryProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-cyan-400" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
            Assignment Profile
          </span>
        </div>
        <StatusBadge status="success" label={volunteer.status} pulse={true} />
      </div>

      {/* Main Info */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.08] text-cyan-455 shrink-0">
          <UserCheck className="size-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[8px] font-mono text-slate-550 uppercase">Active Volunteer</span>
          <h4 className="text-sm font-extrabold text-slate-100 tracking-tight truncate">{volunteer.name}</h4>
          <span className="block text-[10px] font-mono text-slate-500 mt-0.5">{volunteer.email}</span>
        </div>
      </div>

      {/* Sub Info Grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/[0.03] pt-4 font-mono text-[11px] text-slate-400">
        <div>
          <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Assigned Zone</span>
          <span className="text-slate-200 font-semibold">{volunteer.zone}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Role Duty</span>
          <span className="text-slate-200 font-semibold truncate block">{volunteer.role}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Shift Window</span>
          <span className="text-slate-200 font-semibold">{volunteer.shift}</span>
        </div>
        <div className="flex items-start gap-1">
          <Languages className="size-3.5 text-slate-500 mt-0.5 shrink-0" />
          <div>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Language</span>
            <span className="text-slate-200 font-semibold">{volunteer.language}</span>
          </div>
        </div>
      </div>
    </CardGlass>
  )
}
