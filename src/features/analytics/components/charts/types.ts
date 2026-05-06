import type {
  AnalyticsData,
  AnalyticsMetricKey,
} from '#/features/analytics/types/analytics.types'

export interface BaseAnalyticsChartProps {
  data: AnalyticsData[]
  primaryMetric: AnalyticsMetricKey
  secondaryMetric?: AnalyticsMetricKey
}
