import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { Calendar, MapPin, UserCheck } from "lucide-react"

export function ShiftFooter() {
  return (
    <CardGlass className="w-full" hoverEffect={false}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
        
        {/* Shift Details */}
        <div className="flex items-center gap-4 py-2 md:py-0">
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-cyan-400">
            <Calendar className="size-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold font-mono">Current Shift</span>
            <span className="text-sm font-semibold text-slate-200">18:00 — 22:00</span>
          </div>
        </div>

        {/* Volunteer Zone */}
        <div className="flex items-center gap-4 py-3 md:py-0 md:pl-8">
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-cyan-400">
            <MapPin className="size-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold font-mono">Volunteer Zone</span>
            <span className="text-sm font-semibold text-slate-200">East Entrance</span>
          </div>
        </div>

        {/* Assigned Role */}
        <div className="flex items-center gap-4 py-2 md:py-0 md:pl-8">
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-cyan-400">
            <UserCheck className="size-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold font-mono">Assigned Role</span>
            <span className="text-sm font-semibold text-slate-200">Guest Assistance Volunteer</span>
          </div>
        </div>

      </div>
    </CardGlass>
  )
}
