"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { Trophy, Calendar, MapPin, Users2, ShieldAlert } from "lucide-react"

import { MatchContextData } from "@/types/analysis"

interface MatchContextProps {
  context: MatchContextData
}

export function MatchContext({ context }: MatchContextProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header Banner */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04] mb-4">
        <Trophy className="size-4 text-amber-400" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
          Active Match Operations Context
        </span>
      </div>

      {/* Main Context Details */}
      <div className="space-y-4">
        {/* Match Header Flag-Style */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Event Details</span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-white/[0.03] bg-white/[0.01] p-3 rounded-lg">
            <span className="text-sm font-extrabold text-slate-100 tracking-tight">{context.match}</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-semibold shrink-0">
              {context.competition}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Kickoff */}
          <div className="flex items-start gap-2.5">
            <Calendar className="size-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Kickoff</span>
              <span className="text-slate-300 font-semibold">{context.kickoff}</span>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-2.5">
            <MapPin className="size-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Venue</span>
              <span className="text-slate-300 font-semibold truncate block max-w-[130px]">{context.venue}</span>
            </div>
          </div>

          {/* Attendance */}
          <div className="flex items-start gap-2.5">
            <Users2 className="size-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Attendance</span>
              <span className="text-slate-300 font-semibold">{context.attendance}</span>
            </div>
          </div>
        </div>

        {/* Duty assignment info */}
        <div className="border-t border-white/[0.03] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono select-none">
          <div className="flex items-start gap-2">
            <ShieldAlert className="size-4 text-cyan-450 mt-0.5 shrink-0" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Volunteer Zone</span>
              <span className="text-slate-300 font-semibold">{context.volunteerZone}</span>
            </div>
          </div>
          <div>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase mb-0.5">Role</span>
            <span className="text-slate-300 font-semibold">{context.role}</span>
          </div>
        </div>
      </div>
    </CardGlass>
  )
}
