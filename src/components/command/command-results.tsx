"use client"

import React from "react"
import { Compass, Sparkles, AlertCircle, HelpCircle, Loader2 } from "lucide-react"

interface CommandItem {
  id: string
  title: string
  category: "Navigation" | "AI Operations"
  action: () => void
}

interface CommandResultsProps {
  items: CommandItem[]
  activeIndex: number
  onSelectItem: (item: CommandItem) => void
  isLoading: boolean
  aiResponse: string | null
}

export function CommandResults({
  items,
  activeIndex,
  onSelectItem,
  isLoading,
  aiResponse,
}: CommandResultsProps) {
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3 font-mono text-[10px] text-cyan-400">
        <Loader2 className="size-5 animate-spin text-cyan-400" />
        <span>AEGIS CORE COGNITIVE QUERY RUNNING...</span>
      </div>
    )
  }

  if (aiResponse) {
    return (
      <div className="p-4 space-y-2 border-t border-white/[0.04] bg-slate-950/40 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>Cognitive Engine Response</span>
        </div>
        <div className="text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-white/[0.02] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line select-text">
          {aiResponse}
        </div>
        <span className="block text-[8px] text-slate-500 text-right uppercase">
          Esc to close • Ctrl+K to toggle
        </span>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2 text-slate-500 font-mono text-[10px]">
        <AlertCircle className="size-4 text-cyan-500/40" />
        <span>No matching command routes found. Try typing a query.</span>
      </div>
    )
  }

  // Group by category
  const categories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <div className="overflow-y-auto max-h-64 divide-y divide-white/[0.04]">
      {categories.map((category) => {
        const catItems = items.filter((item) => item.category === category)
        return (
          <div key={category} className="p-2 space-y-1">
            <span className="block text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider px-2 py-1">
              {category}
            </span>
            <div className="space-y-0.5">
              {catItems.map((item) => {
                const flatIndex = items.findIndex((i) => i.id === item.id)
                const isSelected = flatIndex === activeIndex

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-mono text-[10px] flex items-center justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.05)]" 
                        : "text-slate-350 bg-transparent border border-transparent hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.category === "Navigation" ? (
                        <Compass className={`size-3.5 ${isSelected ? "text-cyan-400 animate-spin-slow" : "text-slate-500"}`} />
                      ) : (
                        <HelpCircle className={`size-3.5 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                      )}
                      <span>{item.title}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[7.5px] text-cyan-400/70 font-semibold uppercase">
                        Press Enter
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
