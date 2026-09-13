import Link from "next/link"
import { FileStack, CheckCircle2, Clock, ShieldCheck, Compass, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { KpiCard } from "@/components/shared/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WorkflowOverview } from "@/components/dashboard/workflow-overview"
import { ApprovalProgressList } from "@/components/dashboard/approval-progress-list"
import { UpcomingActions } from "@/components/dashboard/upcoming-actions"
import { SmartRecommendations } from "@/components/dashboard/smart-recommendations"
import { ComplianceTrendChart } from "@/components/charts"
import { company } from "@/lib/data"

const kpiIcons = [FileStack, CheckCircle2, Clock, ShieldCheck]

const kpiData = [
  { label: "Active Approvals", value: 5, delta: "+2 this quarter", tone: "info" as const },
  { label: "Completed Approvals", value: 12, delta: "+3 this year", tone: "success" as const },
  { label: "Pending Actions", value: 4, delta: "2 need attention", tone: "warning" as const },
  { label: "Compliance Score", value: "87%", delta: "+4% vs last month", tone: "success" as const },
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title={`Welcome back, ${company.name.split(" ")[0]} Industries`}
        description="Your unified command center for industrial approvals, documents, and compliance."
        actions={
          <>
            <Button variant="outline" render={<Link href="/applications" />}>
              My Applications
            </Button>
            <Button render={<Link href="/approvals" />}>
              <Compass className="size-4" />
              Discover Approvals
            </Button>
          </>
        }
      />

      <DemoBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((k, i) => (
          <KpiCard key={k.label} {...k} icon={kpiIcons[i]} />
        ))}
      </div>

      <div className="mt-6">
        <WorkflowOverview />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ApprovalProgressList />
          <UpcomingActions />
        </div>
        <div className="flex flex-col gap-6">
          <SmartRecommendations />
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Compliance trend</CardTitle>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <Link href="/analytics" className="text-sm font-medium text-primary hover:underline">
                Details
              </Link>
            </CardHeader>
            <CardContent>
              <ComplianceTrendChart />
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-3 p-5">
              <ShieldCheck className="size-6" />
              <div>
                <p className="text-base font-semibold">Single-window clearance</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  SmartClearance consolidates 20+ department approvals into one guided workflow —
                  cutting redundant paperwork and delays.
                </p>
              </div>
              <Button
                variant="secondary"
                className="w-fit"
                render={<Link href="/approvals" />}
              >
                Explore approvals
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
