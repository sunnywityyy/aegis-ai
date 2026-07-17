"use client"

import React, { useRef, useEffect } from "react"
import { Search, CornerDownLeft } from "lucide-react"

interface CommandSearchProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function CommandSearch({ value, onChange, onKeyDown }: CommandSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="relative flex items-center border-b border-white/[0.06] px-4 py-3 shrink-0">
      <Search className="size-4 text-cyan-400 mr-3 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a route or operational query... (e.g. Open Copilot, Show Gate C)"
        className="flex-1 bg-transparent text-slate-100 font-mono text-xs outline-none border-none placeholder-slate-500"
      />
      <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-500 bg-slate-900 border border-white/[0.04] px-2 py-0.5 rounded shadow-sm">
        <span>Enter to execute</span>
        <CornerDownLeft className="size-2 text-slate-500" />
      </div>
    </div>
  )
}
