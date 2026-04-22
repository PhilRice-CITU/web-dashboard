import { ArrowDown } from 'lucide-react'
import type { DashboardSummary } from '../types/dashboard.types'

type Props = {
  summary: DashboardSummary
}

type SignalMetricProps = {
  label: string
  value: string
  footer: string
  status: 'positive' | 'negative'
}

function SignalMetric({ label, value, footer, status }: SignalMetricProps) {
  return (
    <div className="space-y-2 border-b border-border p-5 md:border-r md:nth-2:border-r-0 xl:border-b-0 xl:nth-2:border-r xl:nth-2:border-border xl:nth-4:border-r-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p
        className={`flex items-center gap-1 text-sm ${
          status === 'positive' ? 'text-emerald-700' : 'text-rose-600'
        }`}
      >
        <ArrowDown
          className={status === 'positive' ? 'size-4 rotate-180' : 'size-4'}
        />
        {footer}
      </p>
    </div>
  )
}

export function DashboardMetricsBar({ summary }: Props) {
  const activeDevices = summary.onlineDevices

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      <SignalMetric
        label="Online edge devices"
        value={`${activeDevices}/${summary.totalDevices}`}
        footer={`${summary.totalDevices - activeDevices} offline`}
        status="negative"
      />
      <SignalMetric
        label="Scans processed today"
        value={summary.totalSamples.toLocaleString()}
        footer="Across all stations"
        status="positive"
      />
      <SignalMetric
        label="Average moisture"
        value={`${summary.avgMoistureContent.toFixed(1)}%`}
        footer="PNS target <= 14.0%"
        status="negative"
      />
      <SignalMetric
        label="Avg broken grains"
        value={`${summary.avgBrokenGrainPercentage.toFixed(1)}%`}
        footer="Lower is better"
        status="positive"
      />
    </div>
  )
}
