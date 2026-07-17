"use client"

import React from "react"
import { History } from "lucide-react"

interface CommandHistoryProps {
  onSelect: (command: string) => void
}

export function CommandHistory({ onSelect }: CommandHistoryProps) {
  const [history, setHistory] = React.useState<string[]>([])

  React.useEffect(() => {
    const saved = localStorage.getItem("command-history")
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 10))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  if (history.length === 0) return null

  return (
    <div className="space-y-1.5 pt-2">
      <span className="block text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider px-2">RECENT OPERATIONS</span>
      <div className="space-y-1 max-h-36 overflow-y-auto">
        {history.map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(cmd)}
            className="w-full text-left font-mono text-[9px] text-slate-400 bg-slate-900/30 hover:bg-slate-900 border border-white/[0.01] hover:border-cyan-500/20 px-3 py-1.5 rounded transition-all flex items-center gap-2 cursor-pointer"
          >
            <History className="size-3 text-slate-550" />
            <span className="truncate">{cmd}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function saveCommandToHistory(command: string) {
  if (typeof window === "undefined" || !command.trim()) return
  try {
    const saved = localStorage.getItem("command-history")
    let list: string[] = saved ? JSON.parse(saved) : []
    list = list.filter((item) => item.toLowerCase() !== command.toLowerCase())
    list.unshift(command)
    localStorage.setItem("command-history", JSON.stringify(list.slice(0, 10)))
  } catch (e) {
    console.error(e)
  }
}
