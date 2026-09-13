import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { approvalProgress } from "@/lib/data"
import { statusBadge, progressTone } from "@/lib/status"

export function ApprovalProgressList() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Active approval progress</CardTitle>
          <p className="text-sm text-muted-foreground">Live status across departments</p>
        </div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowUpRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {approvalProgress.map((a) => (
          <div key={a.id} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{a.name}</span>
                <Badge variant={statusBadge(a.status)}>{a.status}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">{a.department}</span>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={a.progress} tone={progressTone(a.status)} className="flex-1" />
              <span className="w-9 text-right text-xs font-semibold text-muted-foreground">
                {a.progress}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Submitted {a.submitted} · Expected decision {a.expected}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
