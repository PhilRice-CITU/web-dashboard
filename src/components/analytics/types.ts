import type {
  AnalyticsAggregation,
  AnalyticsChartType,
  AnalyticsGranularity,
  AnalyticsMetricKey,
} from '#/lib/mockData'

export interface ChartBuilderConfig {
  id: string
  title: string
  chartType: AnalyticsChartType
  primaryMetric: AnalyticsMetricKey
  secondaryMetric?: AnalyticsMetricKey
  aggregation: AnalyticsAggregation
  granularity: AnalyticsGranularity
}

export interface AnalyticsPreset {
  id: string
  name: string
  createdAt: string
  schemaVersion: number
  charts: ChartBuilderConfig[]
}
