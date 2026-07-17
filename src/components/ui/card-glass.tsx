import React from "react"
import { cn } from "@/lib/utils"

interface CardGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverEffect?: boolean
  innerClassName?: string
}

export function CardGlass({
  children,
  className,
  hoverEffect = true,
  innerClassName,
  ...props
}: CardGlassProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.06] bg-slate-950/40 backdrop-blur-md transition-all duration-300",
        hoverEffect && "hover:border-white/[0.12] hover:bg-slate-950/50 hover:shadow-lg hover:shadow-cyan-950/5",
        className
      )}
      {...props}
    >
      {/* Subtle top highlights for premium enterprise look */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className={cn("relative z-10 p-5 md:p-6", innerClassName)}>{children}</div>
    </div>
  )
}
