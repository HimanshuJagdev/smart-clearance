"use client"

import { useMemo, useState } from "react"
import {
  Search,
  FileStack,
  Building,
  CalendarDays,
  CheckCircle2,
  Circle,
  MessageSquareWarning,
  ArrowRight,
  Plus,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Drawer } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { applications, type Application, type Status } from "@/lib/data"
import { statusBadge, progressTone } from "@/lib/status"
import { cn } from "@/lib/utils"

const tabDefs: { value: string; label: string; match: (s: Status) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  { value: "active", label: "Active", match: (s) => ["Submitted", "Under Review", "Query Raised"].includes(s) },
  { value: "query", label: "Query Raised", match: (s) => s === "Query Raised" },
  { value: "approved", label: "Approved", match: (s) => s === "Approved" },
  { value: "draft", label: "Drafts", match: (s) => s === "Draft" },
]

export default function ApplicationsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")
  const [selected, setSelected] = useState<Application | null>(null)

  const filtered = useMemo(() => {
    const def = tabDefs.find((t) => t.value === tab)!
    return applications.filter(
      (a) =>
        def.match(a.status) &&
        (!query ||
          a.approval.toLowerCase().includes(query.toLowerCase()) ||
          a.id.toLowerCase().includes(query.toLowerCase())),
    )
  }, [query, tab])

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track every submitted approval in real time — status, timeline, and next steps in one place."
        actions={
          <Button
            onClick={() => toast({ title: "New application", description: "Pick an approval from Discover to begin.", tone: "info" })}
          >
            <Plus className="size-4" />
            New application
          </Button>
        }
      />

      <DemoBanner />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={tabDefs.map((t) => ({
            value: t.value,
            label: t.label,
            count: applications.filter((a) => t.match(a.status)).length,
          }))}
        />
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 lg:w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileStack} title="No applications here" description="Applications matching this filter will appear here." />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((a) => (
            <Card key={a.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{a.approval}</h3>
                    <Badge variant={statusBadge(a.status)}>{a.status}</Badge>
                    <span className="text-xs text-muted-foreground">#{a.id}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="size-3.5" />
                      {a.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      Submitted {a.submitted}
                    </span>
                    <span>Expected: {a.expected}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 lg:w-64">
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{a.progress}%</span>
                    </div>
                    <Progress value={a.progress} tone={progressTone(a.status)} />
                  </div>
                </div>
                <Button variant="outline" className="shrink-0" onClick={() => setSelected(a)}>
                  Track
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.approval}
        description={selected ? `#${selected.id} · ${selected.department}` : undefined}
        footer={
          selected?.status === "Query Raised" ? (
            <Button
              onClick={() => {
                toast({ title: "Response submitted", description: "Your query response was recorded.", tone: "success" })
                setSelected(null)
              }}
            >
              <MessageSquareWarning className="size-4" />
              Respond to query
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          )
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Current status</p>
                <Badge variant={statusBadge(selected.status)} className="mt-1">
                  {selected.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Expected decision</p>
                <p className="text-sm font-semibold text-foreground">{selected.expected}</p>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Overall progress</span>
                <span className="font-semibold text-foreground">{selected.progress}%</span>
              </div>
              <Progress value={selected.progress} tone={progressTone(selected.status)} />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Application timeline</p>
              <ol className="relative flex flex-col">
                {selected.timeline.map((t, i) => {
                  const isLast = i === selected.timeline.length - 1
                  return (
                    <li key={i} className="flex gap-3 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        {t.done ? (
                          <CheckCircle2 className="size-5 text-success" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground/40" />
                        )}
                        {!isLast && (
                          <span className={cn("mt-1 w-px flex-1", t.done ? "bg-success/40" : "bg-border")} />
                        )}
                      </div>
                      <div className="-mt-0.5 pb-1">
                        <p className={cn("text-sm font-medium", t.done ? "text-foreground" : "text-muted-foreground")}>
                          {t.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                        {t.note && (
                          <p className="mt-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{t.note}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
