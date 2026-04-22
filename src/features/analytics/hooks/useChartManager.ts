import { useState } from 'react'
import type { ChartBuilderConfig } from '#/components/analytics/types'
import { analyticsMetricCatalog } from '#/lib/mockData'
import {
  createDefaultChartConfig,
  isMetricCompatible,
  DEFAULT_METRIC,
} from '../utils/analytics.utils'

export type UseChartManagerReturn = {
  charts: ChartBuilderConfig[]
  editingChartId: string | null
  setEditingChartId: (
    id: string | null | ((current: string | null) => string | null),
  ) => void
  addChart: () => void
  removeChart: (chartId: string) => void
  updateChart: (updatedChart: ChartBuilderConfig) => void
}

export function useChartManager(): UseChartManagerReturn {
  const [editingChartId, setEditingChartId] = useState<string | null>(null)
  const [charts, setCharts] = useState<ChartBuilderConfig[]>([
    createDefaultChartConfig(0),
    {
      ...createDefaultChartConfig(1),
      chartType: 'bar',
      primaryMetric: 'qualityA',
    },
  ])

  const addChart = () => {
    setCharts((current) => [
      ...current,
      createDefaultChartConfig(current.length),
    ])
  }

  const removeChart = (chartId: string) => {
    setCharts((current) =>
      current.length > 1 ? current.filter((c) => c.id !== chartId) : current,
    )
  }

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

    setCharts((current) =>
      current.map((chart) =>
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

  return {
    charts,
    editingChartId,
    setEditingChartId,
    addChart,
    removeChart,
    updateChart,
  }
}
