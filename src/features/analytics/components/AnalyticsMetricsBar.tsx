import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'

type MetricCardProps = {
  label: string
  value: string
  helper: string
}

function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <Card className="rounded-none border-0 border-b border-border ring-0 xl:border-r xl:last:border-r-0 xl:border-b-0">
      <CardHeader className="p-5">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mono text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  )
}

type Props = {
  samples: number
  avgBrokenGrains: number
  premiumShare: number
}

export function AnalyticsMetricsBar({
  samples,
  avgBrokenGrains,
  premiumShare,
}: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 border-b border-border">
      <MetricCard
        label="Samples in range"
        value={samples.toLocaleString()}
        helper="Aggregated from filtered timeline"
      />
      <MetricCard
        label="Average broken grains"
        value={`${avgBrokenGrains.toFixed(2)}%`}
        helper="PNS Premium <= 5%"
      />
      <MetricCard
        label="Premium / Grade 1 share"
        value={`${premiumShare.toFixed(1)}%`}
        helper="Top-tier samples"
      />
    </div>
  )
}
