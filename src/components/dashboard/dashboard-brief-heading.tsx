"use client"

import React from "react"

export function DashboardBriefHeading() {
  return (
    <div className="relative space-y-2 select-none">
      {/* Extremely Subtle Ambient Glow behind Title */}
      <div 
        className="absolute -left-10 -top-10 w-44 h-44 bg-cyan-500/[0.025] rounded-full blur-[64px] pointer-events-none animate-pulse" 
        style={{ animationDuration: "6s" }}
        aria-hidden="true"
      />
      
      <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-medium block">
        Good Evening, Sunil Kumar
      </span>
      
      <div className="flex items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
          AI Command Brief
        </h1>
        <span className="relative flex h-2.5 w-2.5 mt-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
        </span>
      </div>
      
      <p className="text-sm md:text-base text-slate-400 max-w-xl font-normal leading-relaxed">
        Your AI Copilot has analyzed current stadium conditions and prepared today's operational briefing.
      </p>
    </div>
  )
}
