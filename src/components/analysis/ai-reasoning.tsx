"use client"

import React, { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CardGlass } from "@/components/ui/card-glass"
import { Sparkles, Terminal } from "lucide-react"

export interface ReasoningItem {
  id: string
  message: string
  severity: "info" | "warning" | "alert" | "success"
  timestamp: string
  confidence: number
}

interface AIReasoningProps {
  items: ReasoningItem[]
  isComplete: boolean
}

const severityConfig = {
  info: {
    badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    dot: "bg-cyan-400",
  },
  warning: {
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    dot: "bg-amber-400",
  },
  alert: {
    badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    dot: "bg-rose-400",
  },
  success: {
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    dot: "bg-emerald-400",
  },
}

export function AIReasoning({ items, isComplete }: AIReasoningProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom as new items arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [items])

  return (
    <CardGlass className="w-full relative flex flex-col h-[200px]" hoverEffect={false}>
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-3 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-slate-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live AI Reasoning</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-600">ENGINE: COGNITIVE_V2</span>
      </div>

      {/* Terminal logs list */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent"
        role="log"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-600 font-mono italic h-full flex items-center justify-center"
            >
              Awaiting telemetry checks...
            </motion.div>
          ) : (
            items.map((item) => {
              const config = severityConfig[item.severity]
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-start justify-between gap-3 text-xs font-mono border-b border-white/[0.02] pb-2 last:border-b-0"
                >
                  <div className="flex items-start gap-2.5">
                    {/* Timestamp */}
                    <span className="text-slate-600 font-semibold shrink-0 select-none">{item.timestamp}</span>
                    
                    {/* Severity Indicator */}
                    <span className="relative flex h-1.5 w-1.5 mt-1.5 shrink-0">
                      <span className={`inline-flex h-full w-full rounded-full ${config.dot}`} />
                    </span>

                    {/* Message content */}
                    <span className="text-slate-300 font-normal leading-relaxed">{item.message}</span>
                  </div>

                  {/* Confidence rating (only for info/warning/alert, skip for success general statements if preferred, but user requested confidence on each item) */}
                  {item.confidence > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-500/80 shrink-0 font-medium select-none">
                      <Sparkles className="size-3" />
                      <span>{item.confidence}%</span>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </CardGlass>
  )
}
