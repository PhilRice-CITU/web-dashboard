import type { ApiDashboardSummary } from '#/shared/api/contracts'
import { Skeleton } from '#/shared/components/ui/skeleton'

type Props = {
  summary: ApiDashboardSummary | undefined
  isLoading: boolean
}

type TileProps = {
  label: string
  value: string | number | undefined
  isLoading: boolean
}

function Tile({ label, value, isLoading }: TileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {isLoading ? (
        <Skeleton className="h-7 w-16" />
      ) : (
        <span className="text-2xl font-semibold tabular-nums">
          {value ?? '—'}
        </span>
      )}
    </div>
  )
}

export function KpiStrip({ summary, isLoading }: Props) {
  const topGrade = summary?.grade_distribution.reduce(
    (best, g) => (g.value > best.value ? g : best),
    summary.grade_distribution[0],
  )

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Tile
        label="Scans today"
        value={summary?.scans_processed_today}
        isLoading={isLoading}
      />
      <Tile
        label="Online devices"
        value={
          summary
            ? `${summary.online_devices} / ${summary.total_devices}`
            : undefined
        }
        isLoading={isLoading}
      />
      <Tile
        label="Top grade today"
        value={topGrade?.name}
        isLoading={isLoading}
      />
      <Tile
        label="Premium share"
        value={
          summary
            ? `${(
                (summary.grade_distribution.find((g) => g.name === 'Premium')
                  ?.share ?? 0) * 100
              ).toFixed(1)}%`
            : undefined
        }
        isLoading={isLoading}
      />
    </div>
  )
}
