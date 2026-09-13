"use client"

import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Gauge,
  ArrowRight,
  ShieldAlert,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { DemoBanner } from "@/components/shared/demo-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CircularProgress } from "@/components/ui/circular-progress"
import { RiskDonut, ChartLegend } from "@/components/charts"
import {
  delayPredictions,
  complianceRisk,
  riskDistribution,
  type DelayPrediction,
} from "@/lib/data"
import { riskBadge, riskTone } from "@/lib/status"
import { cn } from "@/lib/utils"

export default function InsightsPage() {
  return (
    <div>
      <PageHeader
        title="AI Insights & Prediction"
        description="Machine-assisted intelligence that forecasts approval delays and compliance risks before they become problems."
      />

      <DemoBanner>
        <span className="font-semibold">Illustrative AI:</span> Predictions below are simulated for
        the prototype to demonstrate the concept of delay and risk forecasting. Not a live ML model.
      </DemoBanner>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-b from-accent/40 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" />
              Compliance risk index
            </CardTitle>
            <p className="text-sm text-muted-foreground">Overall organizational risk</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CircularProgress
              value={complianceRisk.score}
              tone="warning"
              label={
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-foreground">{complianceRisk.level}</span>
                  <span className="text-xs text-muted-foreground">risk level</span>
                </div>
              }
            />
            <p className="text-center text-sm text-muted-foreground">
              Risk score {complianceRisk.score}/100 — driven mainly by an overdue filing and
              upcoming environmental deadlines.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning-foreground" />
              Contributing risk factors
            </CardTitle>
            <p className="text-sm text-muted-foreground">What&apos;s influencing your risk score</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {complianceRisk.factors.map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-lg border border-border/70 p-3">
                <span className="text-sm text-foreground">{f.label}</span>
                <Badge
                  variant={f.impact === "High" ? "danger" : f.impact === "Medium" ? "warning" : "neutral"}
                >
                  {f.impact} impact
                </Badge>
              </div>
            ))}
            <div className="mt-1 rounded-lg border border-primary/20 bg-accent/30 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Lightbulb className="size-4 text-primary" />
                Recommended actions
              </p>
              <ul className="flex flex-col gap-1.5">
                {complianceRisk.recommendations.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Gauge className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Approval delay predictions</h2>
          </div>
          {delayPredictions.map((p) => (
            <DelayCard key={p.id} prediction={p} />
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Across active approvals</p>
            </CardHeader>
            <CardContent>
              <RiskDonut />
              <div className="mt-2">
                <ChartLegend items={riskDistribution} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-3 p-5">
              <Sparkles className="size-6" />
              <div>
                <p className="text-base font-semibold">Stay ahead of delays</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Acting on high-risk predictions early can significantly improve on-time approval
                  outcomes.
                </p>
              </div>
              <Button variant="secondary" className="w-fit" render={<Link href="/applications" />}>
                Review applications
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DelayCard({ prediction }: { prediction: DelayPrediction }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">{prediction.approval}</h3>
            <p className="text-sm text-muted-foreground">Predicted delay likelihood</p>
          </div>
          <Badge variant={riskBadge(prediction.risk)}>
            <TrendingUp className="size-3" />
            {prediction.risk} risk
          </Badge>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delay probability</span>
            <span className="font-semibold text-foreground">{prediction.probability}%</span>
          </div>
          <Progress value={prediction.probability} tone={riskTone(prediction.risk)} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contributing factors
          </p>
          <div className="flex flex-wrap gap-1.5">
            {prediction.factors.map((f) => (
              <span
                key={f}
                className="rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "flex items-start gap-2 rounded-lg p-3 text-sm",
            prediction.risk === "Low" ? "bg-success-muted/50 text-success" : "bg-accent/40 text-foreground",
          )}
        >
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>{prediction.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
