import type { AnalyticsData, AnalyticsMetricKey } from '#/lib/mockData'

export interface BaseAnalyticsChartProps {
  data: AnalyticsData[]
  primaryMetric: AnalyticsMetricKey
  secondaryMetric?: AnalyticsMetricKey
}
