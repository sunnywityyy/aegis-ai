import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AnalysisWizard } from "@/components/analysis/analysis-wizard"
import { StadiumBlueprint } from "@/components/analysis/stadium-blueprint"

export const metadata = {
  title: "Aegis AI - Initializing Operations Analysis",
  description: "AI-powered FIFA World Cup Stadium Operations Platform Analysis",
}

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-[#050b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden justify-between">
        
        {/* Back to Dashboard Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 border border-white/[0.08] text-slate-350 font-mono text-[9px] font-bold uppercase rounded-lg hover:text-white transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="size-3 text-cyan-400" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        {/* 1. Subtle Technical Stadium Blueprint Background */}
        <StadiumBlueprint />

        {/* 2. Soft Ambient Lighting (Not neon, just elegant background glow) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[30rem] bg-gradient-to-b from-cyan-950/15 to-transparent rounded-full blur-[100px] pointer-events-none select-none"
          aria-hidden="true"
        />

        <div className="flex-1 flex items-center justify-center relative z-10">
          <AnalysisWizard />
        </div>

        {/* Simple Footer (System Level) */}
        <footer className="relative z-10 py-6 border-t border-white/[0.02] text-center text-[10px] font-mono text-slate-600">
          AEGIS-AI OPERATIONS MANAGEMENT PLATFORM // COGNITIVE LOADING MODULE // SECURE & SYNCED // © 2026
        </footer>

      </div>
    </ProtectedRoute>
  )
}
