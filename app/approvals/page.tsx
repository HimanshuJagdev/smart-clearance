"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  Clock,
  Building,
  FileText,
  CheckCircle2,
  ArrowRight,
  Compass,
  Info,
  IndianRupee,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs } from "@/components/ui/tabs"
import { Drawer } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/components/ui/toast"
import { discoverApprovals, type Approval } from "@/lib/data"

const statusVariant = {
  Required: "danger",
  Recommended: "warning",
  "Not Applicable": "neutral",
} as const

const categoryVariant = {
  Mandatory: "info",
  Conditional: "warning",
  Optional: "neutral",
} as const

const departments = ["All departments", ...Array.from(new Set(discoverApprovals.map((a) => a.department)))]

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [dept, setDept] = useState("All departments")
  const [tab, setTab] = useState("all")
  const [selected, setSelected] = useState<Approval | null>(null)

  const filtered = useMemo(() => {
    return discoverApprovals.filter((a) => {
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.department.toLowerCase().includes(query.toLowerCase())
      const matchesDept = dept === "All departments" || a.department === dept
      const matchesTab =
        tab === "all" ||
        (tab === "required" && a.status === "Required") ||
        (tab === "recommended" && a.status === "Recommended") ||
        (tab === "mandatory" && a.category === "Mandatory")
      return matchesQuery && matchesDept && matchesTab
    })
  }, [query, dept, tab])

  const counts = {
    all: discoverApprovals.length,
    required: discoverApprovals.filter((a) => a.status === "Required").length,
    recommended: discoverApprovals.filter((a) => a.status === "Recommended").length,
    mandatory: discoverApprovals.filter((a) => a.category === "Mandatory").length,
  }

  return (
    <div>
      <PageHeader
        title="Discover Approvals"
        description="Based on your industry profile, here are the approvals relevant to your business — no more guessing which department to approach."
      />

      <DemoBanner>
        <span className="font-semibold">Smart discovery:</span> These approvals are auto-matched to
        Raj Industries&apos; profile (Manufacturing · Automobile Components · Medium MSME · Madhya
        Pradesh). Demo data only.
      </DemoBanner>

      <Card className="mb-6 border-primary/20 bg-accent/30">
        <CardContent className="flex items-start gap-3 p-5">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {counts.required} mandatory approvals identified for your business
            </p>
            <p className="text-sm text-muted-foreground">
              Complete these to operate legally. Recommended approvals may apply based on planned
              expansion.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "all", label: "All", count: counts.all },
            { value: "required", label: "Required", count: counts.required },
            { value: "recommended", label: "Recommended", count: counts.recommended },
            { value: "mandatory", label: "Mandatory", count: counts.mandatory },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search approvals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
          <Select value={dept} onChange={(e) => setDept(e.target.value)} className="sm:w-56">
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Compass} title="No approvals found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <Card key={a.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={categoryVariant[a.category]}>{a.category}</Badge>
                  <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground text-balance">{a.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building className="size-3.5" />
                    {a.department}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{a.purpose}</p>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {a.processing}
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="size-3.5" />
                    {a.fees}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="size-3.5" />
                    {a.renewal}
                  </span>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setSelected(a)}>
                  View details
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
        title={selected?.name}
        description={selected?.department}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button
              render={<Link href="/applications" />}
              onClick={() =>
                toast({
                  title: "Application started",
                  description: `${selected?.name} added to My Applications.`,
                  tone: "success",
                })
              }
            >
              Start application
              <ArrowRight className="size-4" />
            </Button>
          </>
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={categoryVariant[selected.category]}>{selected.category}</Badge>
              <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
            </div>

            <div className="rounded-lg border border-primary/20 bg-accent/30 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
                <Info className="size-3.5" />
                Why this is required
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">{selected.whyRequired}</p>
            </div>

            <DetailRow label="Purpose" value={selected.purpose} />
            <DetailRow label="Issuing authority" value={selected.authority} />
            <div className="grid grid-cols-3 gap-3">
              <MiniStat icon={Clock} label="Processing" value={selected.processing} />
              <MiniStat icon={IndianRupee} label="Fees" value={selected.fees} />
              <MiniStat icon={RefreshCw} label="Renewal" value={selected.renewal} />
            </div>

            <ListBlock icon={CheckCircle2} title="Eligibility criteria" items={selected.eligibility} />
            <ListBlock icon={FileText} title="Documents required" items={selected.documents} />

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Application process</p>
              <ol className="flex flex-col gap-2">
                {selected.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{value}</p>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 p-3">
      <Icon className="size-4 text-muted-foreground" />
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  )
}

function ListBlock({ icon: Icon, title, items }: { icon: typeof FileText; title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-primary" />
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
