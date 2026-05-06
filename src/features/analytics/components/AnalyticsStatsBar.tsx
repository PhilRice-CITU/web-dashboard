import { analyticsMetricCatalog } from '#/features/analytics/constants/analyticsCatalog'

type Props = {
  chartCount: number
  presetCount: number
}

export function AnalyticsStatsBar({ chartCount, presetCount }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 border-x-0 border-b">
      <div className="space-y-1 border-b border-border p-4 xl:border-r xl:border-b-0 border-l-none">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Primary metrics available
        </p>
        <p className="font-mono text-2xl font-semibold text-foreground">
          {analyticsMetricCatalog.length}
        </p>
        <p className="text-sm text-muted-foreground">
          Chart type compatibility is constrained by metric metadata.
        </p>
      </div>
      <div className="space-y-1 border-b border-border p-4 xl:border-r xl:border-b-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Configured charts
        </p>
        <p className="font-mono text-2xl font-semibold text-foreground">
          {chartCount}
        </p>
        <p className="text-sm text-muted-foreground">
          Build multiple charts for station and quality comparisons.
        </p>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Saved presets
        </p>
        <p className="font-mono text-2xl font-semibold text-foreground">
          {presetCount}
        </p>
        <p className="text-sm text-muted-foreground">
          Presets are persisted in local storage with schema versioning.
        </p>
      </div>
    </div>
  )
}
