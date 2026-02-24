import * as React from "react"
import { clsx } from "clsx"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

const variantStyles: Record<string, string> = {
  default: "bg-emerald-600 text-white",
  secondary: "bg-slate-700 text-slate-200",
  destructive: "bg-red-600 text-white",
  outline: "border border-slate-700 text-slate-300",
  success: "bg-green-900/30 text-green-400",
  warning: "bg-amber-900/30 text-amber-400",
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
