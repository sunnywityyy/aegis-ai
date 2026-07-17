"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Sparkles, Clock } from "lucide-react"

interface AnalysisResultsProps {
  isVisible: boolean
}

export function AnalysisResults({ isVisible }: AnalysisResultsProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      {/* 1. Mission Brief Ready Success Card */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 backdrop-blur-sm shadow-lg shadow-emerald-950/5 select-none">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-emerald-300">Mission Brief Ready</h4>
          <p className="text-xs text-emerald-400/80 mt-0.5">
            Operational recommendations have been successfully generated and verified.
          </p>
        </div>
      </div>

      {/* 2. Metadata Grid: Confidence & Prep Time */}
      <div className="grid grid-cols-2 gap-4">
        {/* Confidence Card */}
        <div className="p-4 rounded-xl border border-white/[0.04] bg-slate-950/35 backdrop-blur-sm select-none">
          <div className="flex items-center gap-2 text-slate-500 mb-1.5">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">AI Confidence</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-200 tracking-tight font-mono">96</span>
            <span className="text-sm font-semibold text-cyan-400 font-mono">%</span>
          </div>
        </div>

        {/* Prep Time Card */}
        <div className="p-4 rounded-xl border border-white/[0.04] bg-slate-950/35 backdrop-blur-sm select-none">
          <div className="flex items-center gap-2 text-slate-500 mb-1.5">
            <Clock className="size-3.5 text-slate-400" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Prep Time</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-200 tracking-tight font-mono">2.3</span>
            <span className="text-xs font-semibold text-slate-400 font-mono">seconds</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
