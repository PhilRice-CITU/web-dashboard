import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

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
  avgMoisture: number
  avgScore: number
}

export function AnalyticsMetricsBar({ samples, avgMoisture, avgScore }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 border-b border-border">
      <MetricCard
        label="Samples in range"
        value={samples.toLocaleString()}
        helper="Aggregated from filtered timeline"
      />
      <MetricCard
        label="Average moisture"
        value={`${avgMoisture.toFixed(2)}%`}
        helper="Target <= 14%"
      />
      <MetricCard
        label="Weighted quality score"
        value={avgScore.toFixed(2)}
        helper="Planner-aligned weighted score"
      />
    </div>
  )
}
