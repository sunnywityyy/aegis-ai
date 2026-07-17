"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CardGlass } from "@/components/ui/card-glass"
import { Sparkles, Compass, AlertTriangle, ArrowRight } from "lucide-react"

import { RecommendationItem } from "@/types/analysis"

interface AIRecommendationProps {
  recommendation: RecommendationItem | null
}

const priorityConfig = {
  critical: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  high: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  optimal: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
}

const blockVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function AIRecommendation({ recommendation }: AIRecommendationProps) {
  return (
    <CardGlass className="w-full relative border border-white/[0.04] bg-slate-950/40 p-5 select-none" hoverEffect={false}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Recommendation</h3>
        </div>
        {recommendation && (
          <span className={`text-[9px] font-mono uppercase border px-2 py-0.5 rounded font-semibold ${
            priorityConfig[recommendation.priority]
          }`}>
            {recommendation.priority}
          </span>
        )}
      </div>

      {/* Main recommendation body */}
      <div className="min-h-[220px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!recommendation ? (
            <motion.div
              key="awaiting-rec"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-xs text-slate-600 font-mono italic"
            >
              Compiling operational triggers...
            </motion.div>
          ) : (
            <motion.div
              key={recommendation.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              className="space-y-4"
            >
              {/* Recommended Action */}
              <motion.div variants={blockVariants} className="space-y-1">
                <span className="block text-[9px] font-mono text-slate-500 font-semibold uppercase">Recommended Action</span>
                <div className="text-sm font-extrabold text-white border border-white/[0.04] bg-white/[0.01] px-3 py-2.5 rounded-lg flex items-center gap-2.5 shadow-sm">
                  <Compass className="size-4 text-cyan-405 shrink-0" />
                  <span>{recommendation.action}</span>
                </div>
              </motion.div>

              {/* Grid: Reason & Expected Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reason */}
                <motion.div variants={blockVariants} className="space-y-1">
                  <span className="block text-[9px] font-mono text-slate-500 font-semibold uppercase">Reasoning Trigger</span>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-white/[0.02]">
                    {recommendation.reason}
                  </p>
                </motion.div>

                {/* Expected Impact */}
                <motion.div variants={blockVariants} className="space-y-1">
                  <span className="block text-[9px] font-mono text-slate-500 font-semibold uppercase">Expected Impact</span>
                  <p className="text-xs text-emerald-400 font-normal leading-relaxed bg-emerald-500/[0.02] p-2.5 rounded-lg border border-emerald-500/10">
                    {recommendation.expectedImpact}
                  </p>
                </motion.div>
              </div>

              {/* Confidence Ratio */}
              <motion.div 
                variants={blockVariants}
                className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/[0.03] pt-3 mt-1"
              >
                <span>Operational certainty threshold</span>
                <span className="flex items-center gap-1 text-cyan-405 font-bold">
                  <Sparkles className="size-3.5" />
                  {recommendation.confidence}% Accuracy
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardGlass>
  )
}
