import { useEffect, useMemo, useState } from 'react'
import { Download, Plus, SlidersHorizontal } from 'lucide-react'

import { AnalyticsChartCard } from '#/components/analytics/AnalyticsChartCard'
import { ChartBuilderControls } from '#/components/analytics/ChartBuilderControls'
import { AreaAnalyticsChart } from '#/components/analytics/charts/AreaAnalyticsChart'
import { BarAnalyticsChart } from '#/components/analytics/charts/BarAnalyticsChart'
import { ComposedAnalyticsChart } from '#/components/analytics/charts/ComposedAnalyticsChart'
import { LineAnalyticsChart } from '#/components/analytics/charts/LineAnalyticsChart'
import { PieAnalyticsChart } from '#/components/analytics/charts/PieAnalyticsChart'
import type {
  AnalyticsPreset,
  ChartBuilderConfig,
} from '#/components/analytics/types'
import { PlatformShell } from '#/components/layout/PlatformShell'
import {
  analyticsMetricCatalog,
  generateMockAnalyticsData,
} from '#/lib/mockData'
import type {
  AnalyticsAggregation,
  AnalyticsData,
  AnalyticsMetricKey,
} from '#/lib/mockData'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

const PRESET_STORAGE_KEY = 'analytics-builder-presets-v1'
const PRESET_SCHEMA_VERSION = 1

const DEFAULT_METRIC = 'avgQualityScore' as const

function createDefaultChartConfig(index = 0): ChartBuilderConfig {
  return {
    id: `chart-${Date.now()}-${index}`,
    title: `Chart ${index + 1}`,
    chartType: 'line',
    primaryMetric: DEFAULT_METRIC,
    secondaryMetric: 'avgMoisture',
    aggregation: 'avg',
    granularity: 'daily',
  }
}

function aggregateValues(values: number[], aggregation: AnalyticsAggregation) {
  if (values.length === 0) {
    return 0
  }

  if (aggregation === 'sum') {
    return values.reduce((total, value) => total + value, 0)
  }

  if (aggregation === 'min') {
    return Math.min(...values)
  }

  if (aggregation === 'max') {
    return Math.max(...values)
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

function aggregateAnalyticsByGranularity(
  data: AnalyticsData[],
  config: ChartBuilderConfig,
) {
  if (config.granularity === 'daily') {
    return data
  }

  const buckets: AnalyticsData[][] = []

  data.forEach((row, index) => {
    const bucketIndex = Math.floor(index / 7)
    buckets[bucketIndex] ??= []
    buckets[bucketIndex].push(row)
  })

  const metricKeys = analyticsMetricCatalog.map((entry) => entry.key)

  return buckets.map((bucket, bucketIndex) => {
    const aggregated = {
      date: `Week ${bucketIndex + 1}`,
      totalGrains: 0,
      totalSamples: 0,
      qualityA: 0,
      qualityB: 0,
      qualityC: 0,
      qualityD: 0,
      avgMoisture: 0,
      avgBrokenGrains: 0,
      avgForeignMatter: 0,
      avgChalkiness: 0,
      avgDiscoloration: 0,
      avgLengthMm: 0,
      avgQualityScore: 0,
    } satisfies AnalyticsData

    metricKeys.forEach((metric) => {
      const values = bucket.map((row) => Number(row[metric]))
      aggregated[metric] = Number(
        aggregateValues(values, config.aggregation).toFixed(2),
      )
    })

    return aggregated
  })
}

function isMetricCompatible(metric: AnalyticsMetricKey, chartType: string) {
  return (
    analyticsMetricCatalog
      .find((entry) => entry.key === metric)
      ?.allowedChartTypes.includes(
        chartType as (typeof analyticsMetricCatalog)[number]['allowedChartTypes'][number],
      ) ?? false
  )
}

function renderChart(config: ChartBuilderConfig, data: AnalyticsData[]) {
  if (config.chartType === 'bar') {
    return (
      <BarAnalyticsChart
        data={data}
        primaryMetric={config.primaryMetric}
        secondaryMetric={config.secondaryMetric}
      />
    )
  }

  if (config.chartType === 'area') {
    return (
      <AreaAnalyticsChart
        data={data}
        primaryMetric={config.primaryMetric}
        secondaryMetric={config.secondaryMetric}
      />
    )
  }

  if (config.chartType === 'pie') {
    return (
      <PieAnalyticsChart
        data={data}
        primaryMetric={config.primaryMetric}
        secondaryMetric={config.secondaryMetric}
      />
    )
  }

  if (config.chartType === 'composed') {
    return (
      <ComposedAnalyticsChart
        data={data}
        primaryMetric={config.primaryMetric}
        secondaryMetric={config.secondaryMetric}
      />
    )
  }

  return (
    <LineAnalyticsChart
      data={data}
      primaryMetric={config.primaryMetric}
      secondaryMetric={config.secondaryMetric}
    />
  )
}

export function AnalyticsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [stationFilter, setStationFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [presetError, setPresetError] = useState<string | null>(null)
  const [editingChartId, setEditingChartId] = useState<string | null>(null)
  const [charts, setCharts] = useState<ChartBuilderConfig[]>([
    createDefaultChartConfig(0),
    {
      ...createDefaultChartConfig(1),
      chartType: 'bar',
      primaryMetric: 'qualityA',
    },
  ])
  const [presets, setPresets] = useState<AnalyticsPreset[]>([])

  const analyticsData = useMemo(() => generateMockAnalyticsData(), [])

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(PRESET_STORAGE_KEY)

      if (!storedValue) {
        return
      }

      const parsed = JSON.parse(storedValue) as AnalyticsPreset[]
      const safePresets = parsed.filter(
        (preset) => preset.schemaVersion === PRESET_SCHEMA_VERSION,
      )
      setPresets(safePresets)
      setPresetError(null)
    } catch {
      setPresetError('Saved presets could not be loaded. Storage was reset.')
      localStorage.removeItem(PRESET_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets))
  }, [presets])

  const filteredData = useMemo(() => {
    const start = startDate.length > 0 ? new Date(startDate) : null
    const end = endDate.length > 0 ? new Date(endDate) : null

    return analyticsData.filter((row) => {
      const rowDate = new Date(row.date)
      const normalizedStation = stationFilter.trim().toLowerCase()
      const matchesStation =
        normalizedStation.length === 0 ||
        'philrice ces nationwide'.includes(normalizedStation)
      const matchesDate =
        (!start || rowDate >= start) &&
        (!end || rowDate <= end) &&
        matchesStation

      if (!matchesDate) {
        return false
      }

      if (gradeFilter === 'all') {
        return true
      }

      if (gradeFilter === 'A') {
        return row.qualityA >= row.qualityB
      }

      if (gradeFilter === 'B') {
        return row.qualityB >= row.qualityC
      }

      if (gradeFilter === 'C') {
        return row.qualityC >= row.qualityD
      }

      return row.qualityD > 0
    })
  }, [analyticsData, endDate, gradeFilter, startDate, stationFilter])

  const chartDataMap = useMemo(() => {
    return charts.reduce<Record<string, AnalyticsData[]>>(
      (accumulator, chart) => {
        accumulator[chart.id] = aggregateAnalyticsByGranularity(
          filteredData,
          chart,
        )
        return accumulator
      },
      {},
    )
  }, [charts, filteredData])

  const headlineMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        samples: 0,
        avgMoisture: 0,
        avgScore: 0,
      }
    }

    const samples = filteredData.reduce(
      (total, row) => total + row.totalSamples,
      0,
    )
    const avgMoisture =
      filteredData.reduce((total, row) => total + row.avgMoisture, 0) /
      filteredData.length
    const avgScore =
      filteredData.reduce((total, row) => total + row.avgQualityScore, 0) /
      filteredData.length

    return {
      samples,
      avgMoisture: Number(avgMoisture.toFixed(2)),
      avgScore: Number(avgScore.toFixed(2)),
    }
  }, [filteredData])

  const updateChart = (updatedChart: ChartBuilderConfig) => {
    const compatibleMetrics = analyticsMetricCatalog.filter((metric) =>
      metric.allowedChartTypes.includes(updatedChart.chartType),
    )

    const fallbackMetric = compatibleMetrics[0]?.key ?? DEFAULT_METRIC
    const validPrimaryMetric = isMetricCompatible(
      updatedChart.primaryMetric,
      updatedChart.chartType,
    )
      ? updatedChart.primaryMetric
      : fallbackMetric

    const validSecondaryMetric =
      updatedChart.secondaryMetric &&
      updatedChart.secondaryMetric !== validPrimaryMetric &&
      isMetricCompatible(updatedChart.secondaryMetric, updatedChart.chartType)
        ? updatedChart.secondaryMetric
        : undefined

    setCharts((currentCharts) =>
      currentCharts.map((chart) =>
        chart.id === updatedChart.id
          ? {
              ...updatedChart,
              primaryMetric: validPrimaryMetric,
              secondaryMetric: validSecondaryMetric,
            }
          : chart,
      ),
    )
  }

  const addChart = () => {
    setCharts((currentCharts) => [
      ...currentCharts,
      createDefaultChartConfig(currentCharts.length),
    ])
  }

  const removeChart = (chartId: string) => {
    setCharts((currentCharts) =>
      currentCharts.length > 1
        ? currentCharts.filter((chart) => chart.id !== chartId)
        : currentCharts,
    )
  }

  const loadPreset = (presetId: string) => {
    const preset = presets.find((entry) => entry.id === presetId)

    if (!preset) {
      return
    }

    setCharts(preset.charts)
    setSelectedPresetId(preset.id)
  }

  return (
    <PlatformShell
      title="Analytics"
      description="Track grading quality, moisture risk, and defect trends across stations."
      actions={
        <>
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="sm" className="h-9" />}
            >
              <SlidersHorizontal className="mr-2 size-4" />
              Filter Range
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Analytics</SheetTitle>
                <SheetDescription>
                  Configure date, station, and grade filters for this view.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date-start">Start date</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date-end">End date</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="station">Station</Label>
                  <Input
                    id="station"
                    placeholder="PhilRice CES"
                    value={stationFilter}
                    onChange={(event) => setStationFilter(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade">Grade focus</Label>
                  <Input
                    id="grade"
                    placeholder="all, A, B, C, D"
                    value={gradeFilter}
                    onChange={(event) =>
                      setGradeFilter(event.target.value || 'all')
                    }
                  />
                </div>
              </div>
              <SheetFooter>
                <Button>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button size="sm" className="bg-logo-color h-9">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 border-b border-border">
          <MetricCard
            label="Samples in range"
            value={headlineMetrics.samples.toLocaleString()}
            helper="Aggregated from filtered timeline"
          />
          <MetricCard
            label="Average moisture"
            value={`${headlineMetrics.avgMoisture.toFixed(2)}%`}
            helper="Target <= 14%"
          />
          <MetricCard
            label="Weighted quality score"
            value={headlineMetrics.avgScore.toFixed(2)}
            helper="Planner-aligned weighted score"
          />
        </div>

        {presetError ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {presetError}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 px-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedPresetId ?? ''}
              onValueChange={(value) => setSelectedPresetId(value || null)}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.length === 0 ? (
                  <SelectItem value="" disabled>
                    No presets available
                  </SelectItem>
                ) : (
                  presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedPresetId) {
                  loadPreset(selectedPresetId)
                }
              }}
              disabled={!selectedPresetId}
            >
              Apply Preset
            </Button>
          </div>
          <Button variant="outline" onClick={addChart}>
            <Plus className="mr-2 size-4" />
            Add Chart
          </Button>
        </div>

        {filteredData.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No analytics data matches your current filters.
          </div>
        ) : (
          <div className="mb-0 grid grid-cols-1 border-y border-border lg:grid-cols-2">
            {charts.map((chart, index) => (
              <div
                key={chart.id}
                className="border-b border-border last:border-b-0 lg:odd:border-r lg:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
              >
                <AnalyticsChartCard
                  title={chart.title}
                  subtitle={`Chart ${index + 1} • ${chart.aggregation.toUpperCase()} • ${chart.granularity}`}
                  isEditing={editingChartId === chart.id}
                  onToggleEdit={() =>
                    setEditingChartId((current) =>
                      current === chart.id ? null : chart.id,
                    )
                  }
                  controls={
                    editingChartId === chart.id ? (
                      <ChartBuilderControls
                        config={chart}
                        onChange={updateChart}
                        onRemove={removeChart}
                      />
                    ) : null
                  }
                >
                  {renderChart(chart, chartDataMap[chart.id] ?? [])}
                </AnalyticsChartCard>
              </div>
            ))}
          </div>
        )}

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
              {charts.length}
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
              {presets.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Presets are persisted in local storage with schema versioning.
            </p>
          </div>
        </div>
      </section>
    </PlatformShell>
  )
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
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
