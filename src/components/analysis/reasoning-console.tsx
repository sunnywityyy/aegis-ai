"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CardGlass } from "@/components/ui/card-glass"
import { Sparkles, ArrowDown, Activity } from "lucide-react"

export interface ReasoningChain {
  id: string
  signal: string
  inference: string
  decision: string
  expectedImpact: string
  confidence: number
}

interface ReasoningConsoleProps {
  activeChain: ReasoningChain | null
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function ReasoningConsole({ activeChain }: ReasoningConsoleProps) {
  return (
    <CardGlass className="w-full relative bg-slate-950/30 border border-white/[0.04] p-5 select-none" hoverEffect={false}>
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Reasoning Console</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-600">INFERENCE FLOW TRACE</span>
      </div>

      {/* Structured Nodes */}
      <div className="min-h-[260px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!activeChain ? (
            <motion.div 
              key="awaiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-xs text-slate-600 font-mono italic"
            >
              Listening to operational signals...
            </motion.div>
          ) : (
            <motion.div
              key={activeChain.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              className="space-y-3"
            >
              {/* Node 1: Signal */}
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <span className="w-20 text-[10px] font-mono font-semibold uppercase text-slate-500 pt-0.5">Signal</span>
                <div className="flex-1 text-xs font-mono text-slate-200 border border-white/[0.03] bg-white/[0.01] px-3 py-1.5 rounded-lg">
                  {activeChain.signal}
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div variants={itemVariants} className="flex justify-center pl-20 -my-1">
                <ArrowDown className="size-3 text-slate-600" />
              </motion.div>

              {/* Node 2: Inference */}
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <span className="w-20 text-[10px] font-mono font-semibold uppercase text-slate-500 pt-0.5">Inference</span>
                <div className="flex-1 text-xs font-mono text-cyan-400/90 border border-cyan-500/10 bg-cyan-500/[0.01] px-3 py-1.5 rounded-lg">
                  {activeChain.inference}
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div variants={itemVariants} className="flex justify-center pl-20 -my-1">
                <ArrowDown className="size-3 text-slate-600" />
              </motion.div>

              {/* Node 3: Decision */}
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <span className="w-20 text-[10px] font-mono font-semibold uppercase text-slate-500 pt-0.5">Decision</span>
                <div className="flex-1 text-xs font-mono text-slate-200 border border-white/[0.03] bg-white/[0.01] px-3 py-1.5 rounded-lg">
                  {activeChain.decision}
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div variants={itemVariants} className="flex justify-center pl-20 -my-1">
                <ArrowDown className="size-3 text-slate-600" />
              </motion.div>

              {/* Node 4: Expected Impact */}
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <span className="w-20 text-[10px] font-mono font-semibold uppercase text-slate-500 pt-0.5">Impact</span>
                <div className="flex-1 text-xs font-mono text-emerald-400 border border-emerald-500/10 bg-emerald-500/[0.01] px-3 py-1.5 rounded-lg">
                  {activeChain.expectedImpact}
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div variants={itemVariants} className="flex justify-center pl-20 -my-1">
                <ArrowDown className="size-3 text-slate-600" />
              </motion.div>

              {/* Node 5: Confidence */}
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <span className="w-20 text-[10px] font-mono font-semibold uppercase text-slate-500 pt-0.5">Confidence</span>
                <div className="flex-1 flex items-center justify-between text-xs font-mono text-slate-300 border border-white/[0.03] bg-slate-900/60 px-3 py-1.5 rounded-lg">
                  <span>Inference accuracy threshold</span>
                  <span className="flex items-center gap-1 text-cyan-400 font-bold font-mono">
                    <Sparkles className="size-3" />
                    {activeChain.confidence}%
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardGlass>
  )
}
