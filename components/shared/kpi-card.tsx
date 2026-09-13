import { TrendingUp, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const toneStyles = {
  info: "bg-info-muted text-info",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning-foreground",
  default: "bg-primary/10 text-primary",
} as const

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string
  value: string | number
  delta?: string
  icon: LucideIcon
  tone?: keyof typeof toneStyles
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-lg", toneStyles[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <TrendingUp className="size-3.5 text-success" />
          {delta}
        </div>
      )}
    </Card>
  )
}
