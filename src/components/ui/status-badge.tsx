import React from "react"
import { cn } from "@/lib/utils"

export type StatusType = "success" | "warning" | "error" | "info"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType
  label: string
  pulse?: boolean
}

const statusConfig = {
  success: {
    bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    dot: "bg-emerald-400 shadow-emerald-400/50",
  },
  warning: {
    bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    dot: "bg-amber-400 shadow-amber-400/50",
  },
  error: {
    bg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    dot: "bg-rose-400 shadow-rose-400/50",
  },
  info: {
    bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    dot: "bg-cyan-400 shadow-cyan-400/50",
  },
}

export function StatusBadge({
  status,
  label,
  pulse = true,
  className,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none",
        config.bg,
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            config.dot.split(" ")[0]
          )} />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full shadow-[0_0_8px_1px]", config.dot)} />
      </span>
      <span>{label}</span>
    </div>
  )
}
