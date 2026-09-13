import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { workflowSteps } from "@/lib/data"

export function WorkflowOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How SmartClearance works</CardTitle>
        <p className="text-sm text-muted-foreground">
          A unified, end-to-end journey from discovery to compliance — replacing fragmented,
          department-by-department paperwork.
        </p>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, i) => (
            <li key={step.key}>
              <Link
                href={step.href}
                className="group flex h-full flex-col gap-2 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
