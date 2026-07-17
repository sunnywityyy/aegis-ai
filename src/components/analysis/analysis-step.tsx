"use client"

import React from "react"
import { Check, Loader2 } from "lucide-react"

export type StepStatus = "queued" | "analyzing" | "completed"

interface AnalysisStepProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  progress: number
  status: StepStatus
  activeLabel: string
}

export function AnalysisStep({ icon: Icon, title, progress, status, activeLabel }: AnalysisStepProps) {
  const isCompleted = status === "completed"
  const isAnalyzing = status === "analyzing"
  const isQueued = status === "queued"

  return (
    <div 
      className="flex flex-col gap-2 p-3 md:p-4 rounded-xl border border-white/[0.03] bg-slate-950/20 backdrop-blur-sm transition-all duration-300 select-none"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${title} analysis progress`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* 1. Dynamic Status Icon with animation */}
          <div 
            className={`p-2 rounded-lg border transition-colors duration-300 ${
              isCompleted 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : isAnalyzing
                ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                : "bg-white/[0.02] border-white/[0.04] text-slate-600"
            }`}
          >
            {isCompleted ? (
              <Check className="size-4 stroke-[3]" />
            ) : isAnalyzing ? (
              <Loader2 className="size-4 animate-spin text-cyan-400" />
            ) : (
              <Icon className="size-4 opacity-50" />
            )}
          </div>
          
          <span 
            className={`text-sm font-semibold transition-colors duration-300 ${
              isCompleted 
                ? "text-slate-300" 
                : isAnalyzing
                ? "text-white"
                : "text-slate-500"
            }`}
          >
            {title}
          </span>
        </div>

        {/* Status label (Dynamic Activity Text) */}
        <span 
          className={`text-xs text-right font-medium max-w-[200px] truncate transition-colors duration-300 ${
            isCompleted 
              ? "text-emerald-400/90 font-semibold" 
              : isAnalyzing
              ? "text-cyan-400 font-mono"
              : "text-slate-600 font-mono"
          }`}
        >
          {isCompleted ? "✓ Analysis Complete" : isAnalyzing ? activeLabel : "Queued"}
        </span>
      </div>

      {/* 2. Low profile elegant progress bar */}
      <div className="h-1.5 w-full bg-slate-900/60 rounded-full overflow-hidden border border-white/[0.02]">
        <div 
          className={`h-full rounded-full transition-all duration-100 ease-out ${
            isCompleted 
              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
              : isAnalyzing
              ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              : "bg-transparent"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
