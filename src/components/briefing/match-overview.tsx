"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { MatchDocument } from "@/types/firestore"
import { Trophy, MapPin, Calendar, Users } from "lucide-react"

interface MatchOverviewProps {
  match: MatchDocument
}

export function MatchOverview({ match }: MatchOverviewProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04] mb-4">
        <Trophy className="size-4 text-amber-400" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
          Active Match Telemetry
        </span>
      </div>

      {/* Match Heading */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1 border border-white/[0.03] bg-white/[0.01] p-3.5 rounded-xl">
          <span className="text-[8px] font-mono uppercase text-slate-550 tracking-wider">Tournament Match</span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <h3 className="text-sm font-extrabold text-slate-100 tracking-tight">{match.match}</h3>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-semibold shrink-0 w-max">
              {match.competition}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <Calendar className="size-4 text-slate-550 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Kickoff</span>
              <span className="text-slate-200 font-semibold">{match.kickoff}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="size-4 text-slate-550 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Venue</span>
              <span className="text-slate-200 font-semibold truncate block max-w-[130px]">{match.venue}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="size-4 text-slate-550 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold uppercase">Attendance</span>
              <span className="text-slate-200 font-semibold">{match.attendance}</span>
            </div>
          </div>
        </div>
      </div>
    </CardGlass>
  )
}
