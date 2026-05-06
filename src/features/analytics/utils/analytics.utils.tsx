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

const DEFAULT_METRIC = 'avgQualityScore' as const

export function createDefaultChartConfig(index = 0): ChartBuilderConfig {
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
    qualityA: point.quality_a,
    qualityB: point.quality_b,
    qualityC: point.quality_c,
    qualityD: point.quality_d,
    avgMoisture: point.avg_moisture,
    avgBrokenGrains: point.avg_broken_grains,
    avgForeignMatter: point.avg_foreign_matter,
    avgChalkiness: point.avg_chalkiness,
    avgDiscoloration: point.avg_discoloration,
    avgLengthMm: point.avg_length_mm,
    avgQualityScore: point.avg_quality_score,
  }
}

export { DEFAULT_METRIC }
