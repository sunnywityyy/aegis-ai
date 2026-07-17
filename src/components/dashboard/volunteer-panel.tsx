"use client"

import React, { useState } from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { VolunteerDocument } from "@/types/firestore"
import { User, ShieldAlert, CheckSquare, Square, Calendar } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

interface VolunteerPanelProps {
  volunteer: VolunteerDocument
}

export function VolunteerPanel({ volunteer }: VolunteerPanelProps) {
  // Pre-seed tasks list specific to the volunteer's role
  const initialTasks = [
    { id: "t-1", text: "Validate scanner lanes operations velocity at Gate C.", completed: false },
    { id: "t-2", text: "Maintain guest assistance route patrols for accessibility paths.", completed: false },
    { id: "t-3", text: "Check rain cover shelter setups near sector entrance walkways.", completed: true },
  ]
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (id: string) => {
    setTasks((prev) => 
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <User className="size-4 text-cyan-405" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Volunteer Operations</h3>
        </div>
        <StatusBadge status="success" label={volunteer.status} pulse={true} />
      </div>

      {/* Info Badge Card */}
      <div className="flex items-center gap-3.5 p-3 rounded-lg border border-white/[0.02] bg-white/[0.01] mb-4">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.08] text-cyan-405 shrink-0">
          <User className="size-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-extrabold text-slate-100 tracking-tight truncate">{volunteer.name}</h4>
          <span className="block text-[9px] font-mono text-slate-500 truncate mt-0.5">{volunteer.email}</span>
        </div>
      </div>

      {/* Shift detail metrics */}
      <div className="grid grid-cols-2 gap-4 border-b border-white/[0.03] pb-4 mb-4 font-mono text-[10px] text-slate-450 leading-relaxed">
        <div>
          <span className="block text-[8px] text-slate-550 font-semibold uppercase mb-0.5">Duty Zone</span>
          <span className="text-slate-200 font-semibold">{volunteer.zone}</span>
        </div>
        <div>
          <span className="block text-[8px] text-slate-550 font-semibold uppercase mb-0.5">Shift Window</span>
          <span className="text-slate-200 font-semibold">{volunteer.shift}</span>
        </div>
        <div>
          <span className="block text-[8px] text-slate-550 font-semibold uppercase mb-0.5">Duty Assignment Role</span>
          <span className="text-slate-200 font-semibold truncate block">{volunteer.role}</span>
        </div>
        <div className="flex items-start gap-1">
          <Calendar className="size-3 text-slate-550 shrink-0 mt-0.5" />
          <div>
            <span className="block text-[8px] text-slate-550 font-semibold uppercase mb-0.5">Language Prof.</span>
            <span className="text-slate-200 font-semibold">{volunteer.language}</span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase mb-1">
          Shift Task Checklist
        </span>
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer text-xs ${
                task.completed
                  ? "bg-slate-900/20 border-white/[0.02] text-slate-550 line-through"
                  : "bg-slate-950/60 border-white/[0.04] text-slate-300 hover:border-cyan-550/20"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {task.completed ? (
                  <CheckSquare className="size-3.5 text-cyan-405" />
                ) : (
                  <Square className="size-3.5 text-slate-600" />
                )}
              </div>
              <span className="leading-snug font-sans">{task.text}</span>
            </button>
          ))}
        </div>
      </div>
    </CardGlass>
  )
}
export default VolunteerPanel
