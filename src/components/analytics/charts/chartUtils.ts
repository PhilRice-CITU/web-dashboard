import { analyticsMetricCatalog } from '#/lib/mockData'
import type { AnalyticsData, AnalyticsMetricKey } from '#/lib/mockData'

export function getMetricLabel(metric: AnalyticsMetricKey) {
  return (
    analyticsMetricCatalog.find((entry) => entry.key === metric)?.label ??
    metric
  )
}

export function getMetricValue(row: AnalyticsData, metric: AnalyticsMetricKey) {
  return row[metric]
}

export function getMetricColor(index = 0) {
  const palette = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444']
  return palette[index % palette.length]
}
