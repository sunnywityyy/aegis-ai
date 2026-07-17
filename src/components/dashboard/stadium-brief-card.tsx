"use client"

import React from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Users, 
  CloudRain, 
  Train, 
  Sparkles,
  ArrowRight,
  Monitor
} from "lucide-react"
import { motion } from "framer-motion"

interface StadiumMetricProps {
  icon: React.ReactNode
  label: string
  value: string
  badge?: React.ReactNode
  iconColor: string
}

function StadiumMetric({ icon, label, value, badge, iconColor }: StadiumMetricProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-b-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] ${iconColor}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-400">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-200">{value}</span>
        {badge}
      </div>
    </div>
  )
}

export function StadiumBriefCard() {
  return (
    <CardGlass className="w-full flex flex-col justify-between" hoverEffect={false}>
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="size-4 animate-pulse" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">System Analysis</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">ID: AEGIS-STAD-01</span>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-1 mb-8">
          <StadiumMetric
            icon={<Building2 className="size-4" />}
            label="Stadium Status"
            value="Operational"
            iconColor="text-emerald-400"
            badge={<StatusBadge status="success" label="Active" />}
          />
          <StadiumMetric
            icon={<Users className="size-4" />}
            label="Crowd Level"
            value="Normal"
            iconColor="text-cyan-400"
            badge={<StatusBadge status="info" label="Optimal" />}
          />
          <StadiumMetric
            icon={<CloudRain className="size-4" />}
            label="Weather"
            value="Rain expected in 22 min"
            iconColor="text-amber-400"
            badge={<StatusBadge status="warning" label="Precipitation" pulse={false} />}
          />
          <StadiumMetric
            icon={<Train className="size-4" />}
            label="Transport"
            value="Metro delayed by 4 min"
            iconColor="text-amber-400"
            badge={<StatusBadge status="warning" label="Line 2" pulse={false} />}
          />
          <StadiumMetric
            icon={<Sparkles className="size-4" />}
            label="AI Briefings Prepared"
            value="3 Tasks Ready"
            iconColor="text-cyan-400"
            badge={
              <span className="inline-flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md px-2 py-0.5 text-xs font-semibold">
                Priority
              </span>
            }
          />
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/[0.04]">
        <motion.div 
          className="flex-1"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          <Button 
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all h-10 shadow-lg shadow-cyan-950/20 gap-2 cursor-pointer border border-cyan-400/30 rounded-lg justify-center text-sm"
          >
            Begin Shift
            <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />
          </Button>
        </motion.div>

        <Button 
          variant="outline"
          className="flex-1 border-white/[0.08] hover:border-white/20 bg-slate-950/30 hover:bg-slate-950/50 text-slate-300 hover:text-slate-100 transition-all h-10 gap-2 rounded-lg justify-center text-sm cursor-pointer"
        >
          <Monitor className="size-4" />
          View Live Overview
        </Button>
      </div>
    </CardGlass>
  )
}
