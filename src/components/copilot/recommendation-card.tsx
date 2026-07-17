"use client"

import React, { useState } from "react"
import { CheckSquare, Square } from "lucide-react"

interface RecommendationCardProps {
  actions: string[]
}

export function RecommendationCard({ actions }: RecommendationCardProps) {
  // Track checked index states
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({})

  const toggleCheck = (idx: number) => {
    setCheckedStates((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  return (
    <div className="space-y-2">
      {actions.map((action, idx) => {
        const isChecked = !!checkedStates[idx]
        return (
          <button
            key={idx}
            type="button"
            onClick={() => toggleCheck(idx)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
              isChecked 
                ? "bg-slate-900/20 border-white/[0.02] text-slate-500 line-through" 
                : "bg-slate-900 border-white/[0.04] text-slate-200 hover:border-cyan-550/20"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isChecked ? (
                <CheckSquare className="size-4 text-cyan-405" />
              ) : (
                <Square className="size-4 text-slate-600" />
              )}
            </div>
            <span className="text-xs leading-relaxed font-sans">{action}</span>
          </button>
        )
      })}
    </div>
  )
}
