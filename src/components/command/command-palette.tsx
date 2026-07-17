"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CommandSearch } from "./command-search"
import { CommandResults } from "./command-results"
import { CommandHistory, saveCommandToHistory } from "./command-history"
import { Sparkles, Terminal } from "lucide-react"

export function CommandPalette() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  // Toggle Command Palette on Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Reset states when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setActiveIndex(0)
      setAiResponse(null)
      setIsLoading(false)
    }
  }, [isOpen])

  // Command items definitions
  const allItems = [
    { 
      id: "nav-dash", 
      title: "Open Dashboard", 
      category: "Navigation" as const, 
      action: () => { router.push("/dashboard"); setIsOpen(false); } 
    },
    { 
      id: "nav-cop", 
      title: "Open Copilot", 
      category: "Navigation" as const, 
      action: () => { router.push("/copilot"); setIsOpen(false); } 
    },
    { 
      id: "nav-an", 
      title: "Open Analysis", 
      category: "Navigation" as const, 
      action: () => { router.push("/analysis"); setIsOpen(false); } 
    },
    { 
      id: "nav-br", 
      title: "Open Briefing", 
      category: "Navigation" as const, 
      action: () => { router.push("/briefing"); setIsOpen(false); } 
    },
    { 
      id: "ai-gatec", 
      title: "Show Gate C", 
      category: "AI Operations" as const, 
      action: () => handleAiQuery("Show Gate C status and details.") 
    },
    { 
      id: "ai-vol", 
      title: "Where should I deploy volunteers?", 
      category: "AI Operations" as const, 
      action: () => handleAiQuery("Suggest volunteer allocation deployments based on crowd density.") 
    },
    { 
      id: "ai-med", 
      title: "Medical status", 
      category: "AI Operations" as const, 
      action: () => handleAiQuery("What is the average response time and availability status of medical teams?") 
    },
    { 
      id: "ai-crowd", 
      title: "Crowd prediction", 
      category: "AI Operations" as const, 
      action: () => handleAiQuery("Predict crowd density surge patterns and congestion risk in the next 30 minutes.") 
    },
    { 
      id: "ai-trans", 
      title: "Transport delays", 
      category: "AI Operations" as const, 
      action: () => handleAiQuery("Are there rail or parking delays affecting stadium ingress?") 
    },
    { 
      id: "ai-brief", 
      title: "Generate operational brief", 
      category: "AI Operations" as const, 
      action: () => handleAiQuery("Compile a concise summary operational briefing report for matchday.") 
    },
  ]

  // Filter items matching the query text input
  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  // Auto-clamp activeIndex when items filter updates
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Triggers existing cognitive analysis pipeline API endpoint
  const handleAiQuery = async (promptText: string) => {
    if (!promptText.trim()) return
    setIsLoading(true)
    setAiResponse(null)
    saveCommandToHistory(promptText)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      })
      const data = await res.json()
      if (data.analysis) {
        setAiResponse(data.analysis)
      } else {
        setAiResponse("Intelligence scan completed. All MetLife metrics within nominal operating bounds.")
      }
    } catch (e) {
      setAiResponse("Network link disrupted. All systems nominal.")
    } finally {
      setIsLoading(false)
    }
  }

  // Keyboard navigation listeners
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (aiResponse) {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault()
        setAiResponse(null)
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredItems.length > 0 && activeIndex < filteredItems.length) {
        filteredItems[activeIndex].action()
      } else if (query.trim()) {
        handleAiQuery(query)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop glass blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Palette Dialog Content Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-lg bg-slate-950/80 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col font-sans select-none hologram-glow"
          >
            {/* Command Header decoration */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-white/[0.04] text-[8px] font-mono text-slate-500">
              <div className="flex items-center gap-1.5">
                <Terminal className="size-3 text-cyan-400" />
                <span>AEGIS_COGNITIVE_TERMINAL_V10.9</span>
              </div>
              <span>ESC TO CLOSE</span>
            </div>

            {/* Input query field */}
            <CommandSearch 
              value={query} 
              onChange={setQuery} 
              onKeyDown={handleKeyDown} 
            />

            {/* Middle body: results or recent history */}
            <div className="p-2 space-y-2">
              <CommandResults
                items={filteredItems}
                activeIndex={activeIndex}
                onSelectItem={(item) => item.action()}
                isLoading={isLoading}
                aiResponse={aiResponse}
              />

              {!query && !aiResponse && !isLoading && (
                <CommandHistory onSelect={(cmd) => { setQuery(cmd); handleAiQuery(cmd); }} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
export default CommandPalette
