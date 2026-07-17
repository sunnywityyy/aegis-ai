"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { UserCheck } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

import { VolunteerProfileData } from "@/types/analysis"

interface VolunteerProfileProps {
  profile: VolunteerProfileData
}

export function VolunteerProfile({ profile }: VolunteerProfileProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      <div className="flex items-center gap-3">
        {/* Profile Avatar Icon */}
        <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.08] text-cyan-400 shrink-0">
          <UserCheck className="size-5" />
        </div>
        
        {/* Info detail */}
        <div className="flex-1 min-w-0">
          <span className="block text-[9px] font-mono text-slate-500 font-semibold uppercase mb-0.5">Volunteer Duty Profile</span>
          <h4 className="text-sm font-extrabold text-slate-100 tracking-tight truncate">{profile.name}</h4>
        </div>
        
        {/* Status Indicator */}
        <StatusBadge status="success" label={profile.status} pulse={true} className="shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/[0.03] font-mono text-[11px] text-slate-400">
        <div>
          <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Zone</span>
          <span className="text-slate-200 font-semibold">{profile.zone}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Shift</span>
          <span className="text-slate-200 font-semibold">{profile.shift}</span>
        </div>
      </div>
    </CardGlass>
  )
}
