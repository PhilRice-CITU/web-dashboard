import { Download } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { PlatformShell } from '#/shared/components/layout/PlatformShell'

import { useAnalyticsFilters } from '#/features/analytics/hooks/useAnalyticsFilters'
import { useAnalyticsData } from '#/features/analytics/hooks/useAnalyticsData'
import { useChartManager } from '#/features/analytics/hooks/useChartManager'
import { usePresetManager } from '#/features/analytics/hooks/usePresetManager'
import { AnalyticsMetricsBar } from '#/features/analytics/components/AnalyticsMetricsBar'
import { AnalyticsFilterSheet } from '#/features/analytics/components/AnalyticsFilterSheet'
import { PresetToolbar } from '#/features/analytics/components/PresetToolbar'
import { ChartGrid } from '#/features/analytics/components/ChartGrid'
import { AnalyticsStatsBar } from '#/features/analytics/components/AnalyticsStatsBar'

export function AnalyticsPage() {
  const filters = useAnalyticsFilters()
  const chartManager = useChartManager()
  const presets = usePresetManager()
  const {
    filteredData,
    chartDataMap,
    headlineMetrics,
    isTrendsLoading,
    trendsError,
  } = useAnalyticsData(filters.trendsUrl, filters, chartManager.charts)

  return (
    <PlatformShell
      title="Analytics"
      description="Track grading quality, moisture risk, and defect trends across stations."
      actions={
        <>
          <AnalyticsFilterSheet
            startDate={filters.startDate}
            onStartDate={filters.setStartDate}
            endDate={filters.endDate}
            onEndDate={filters.setEndDate}
            stationFilter={filters.stationFilter}
            onStationFilter={filters.setStationFilter}
            gradeFilter={filters.gradeFilter}
            onGradeFilter={filters.setGradeFilter}
          />
          <Button size="sm" className="bg-logo-color h-9">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </>
      }
    >
      <section className="space-y-4">
        <AnalyticsMetricsBar
          samples={headlineMetrics.samples}
          avgBrokenGrains={headlineMetrics.avgBrokenGrains}
          premiumShare={headlineMetrics.premiumShare}
        />

        {presets.presetError && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {presets.presetError}
          </div>
        )}
        {trendsError && (
          <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            Failed to load analytics trends from the API.
          </div>
        )}
        {isTrendsLoading && (
          <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
            Loading analytics trends...
          </div>
        )}

        <PresetToolbar
          presets={presets.presets}
          selectedPresetId={presets.selectedPresetId}
          onSelectPreset={presets.setSelectedPresetId}
          onApplyPreset={() => {
            if (presets.selectedPresetId) {
              presets.loadPreset(presets.selectedPresetId, (charts) => {
                charts.forEach((chart) => chartManager.updateChart(chart))
              })
            }
          }}
          onAddChart={chartManager.addChart}
        />

        {filteredData.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No analytics data matches your current filters.
          </div>
        ) : (
          <ChartGrid
            charts={chartManager.charts}
            chartDataMap={chartDataMap}
            editingChartId={chartManager.editingChartId}
            onToggleEdit={(id) =>
              chartManager.setEditingChartId((current) =>
                current === id ? null : id,
              )
            }
            onUpdateChart={chartManager.updateChart}
            onRemoveChart={chartManager.removeChart}
          />
        )}

        <AnalyticsStatsBar
          chartCount={chartManager.charts.length}
          presetCount={presets.presets.length}
        />
      </section>
    </PlatformShell>
  )
}
