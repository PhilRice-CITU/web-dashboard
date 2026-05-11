import type { ApiAnalyticsTrendPoint } from '#/shared/api/contracts'
import type {
  AnalyticsAggregation,
  AnalyticsData,
  AnalyticsMetricKey,
  ChartBuilderConfig,
} from '#/features/analytics/types/analytics.types'
import { analyticsMetricCatalog } from '#/features/analytics/constants/analyticsCatalog'
import { BarAnalyticsChart } from '#/features/analytics/components/charts/BarAnalyticsChart'
import { AreaAnalyticsChart } from '#/features/analytics/components/charts/AreaAnalyticsChart'
import { PieAnalyticsChart } from '#/features/analytics/components/charts/PieAnalyticsChart'
import { ComposedAnalyticsChart } from '#/features/analytics/components/charts/ComposedAnalyticsChart'
import { LineAnalyticsChart } from '#/features/analytics/components/charts/LineAnalyticsChart'

const DEFAULT_METRIC = 'avgBrokenGrains' as const

export function createDefaultChartConfig(index = 0): ChartBuilderConfig {
  return {
    id: `chart-${Date.now()}-${index}`,
    title: `Chart ${index + 1}`,
    chartType: 'line',
    primaryMetric: DEFAULT_METRIC,
    secondaryMetric: 'avgChalkiness',
    aggregation: 'avg',
    granularity: 'daily',
  }
}

export function aggregateValues(
  values: number[],
  aggregation: AnalyticsAggregation,
): number {
  if (values.length === 0) return 0
  if (aggregation === 'sum') return values.reduce((total, v) => total + v, 0)
  if (aggregation === 'min') return Math.min(...values)
  if (aggregation === 'max') return Math.max(...values)
  return values.reduce((total, v) => total + v, 0) / values.length
}

export function aggregateAnalyticsByGranularity(
  data: AnalyticsData[],
  config: ChartBuilderConfig,
): AnalyticsData[] {
  if (config.granularity === 'daily') return data

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
      gradePremium: 0,
      grade1: 0,
      grade2: 0,
      grade3: 0,
      grade4: 0,
      grade5: 0,
      gradeOffGrade: 0,
      avgBrokenGrains: 0,
      avgBrewers: 0,
      avgChalkiness: 0,
      avgDiscoloration: 0,
      avgDamaged: 0,
      avgRed: 0,
      avgLengthMm: 0,
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

export function isMetricCompatible(
  metric: AnalyticsMetricKey,
  chartType: string,
): boolean {
  return (
    analyticsMetricCatalog
      .find((entry) => entry.key === metric)
      ?.allowedChartTypes.includes(
        chartType as (typeof analyticsMetricCatalog)[number]['allowedChartTypes'][number],
      ) ?? false
  )
}

export function renderChart(
  config: ChartBuilderConfig,
  data: AnalyticsData[],
): React.ReactElement {
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

export function mapTrendPointToAnalyticsData(
  point: ApiAnalyticsTrendPoint,
): AnalyticsData {
  return {
    date: point.date,
    totalGrains: point.total_grains,
    totalSamples: point.total_samples,
    gradePremium: point.grade_counts.Premium ?? 0,
    grade1: point.grade_counts['Grade no. 1'] ?? 0,
    grade2: point.grade_counts['Grade no. 2'] ?? 0,
    grade3: point.grade_counts['Grade no. 3'] ?? 0,
    grade4: point.grade_counts['Grade no. 4'] ?? 0,
    grade5: point.grade_counts['Grade no. 5'] ?? 0,
    gradeOffGrade: point.grade_counts['Off-Grade'] ?? 0,
    avgBrokenGrains: point.factor_averages.broken ?? 0,
    avgBrewers: point.factor_averages.brewers ?? 0,
    avgChalkiness: point.factor_averages.chalky ?? 0,
    avgDiscoloration: point.factor_averages.discolored ?? 0,
    avgDamaged: point.factor_averages.damaged ?? 0,
    avgRed: point.factor_averages.red ?? 0,
    avgLengthMm: point.avg_length_mm,
  }
}

export { DEFAULT_METRIC }
