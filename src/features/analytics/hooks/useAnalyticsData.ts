import { useMemo } from 'react'
import type { ApiAnalyticsTrendsResponse } from '#/shared/api/contracts'
import { useFetch } from '#/shared/hooks/useApi'
import type {
  AnalyticsData,
  ChartBuilderConfig,
} from '#/features/analytics/types/analytics.types'
import {
  mapTrendPointToAnalyticsData,
  aggregateAnalyticsByGranularity,
} from '../utils/analytics.utils'

export type UseAnalyticsDataReturn = {
  analyticsData: AnalyticsData[]
  filteredData: AnalyticsData[]
  chartDataMap: Record<string, AnalyticsData[]>
  headlineMetrics: { samples: number; avgMoisture: number; avgScore: number }
  isTrendsLoading: boolean
  trendsError: unknown
}

export function useAnalyticsData(
  trendsUrl: string,
  filters: {
    startDate: string
    endDate: string
    stationFilter: string
    gradeFilter: string
  },
  charts: ChartBuilderConfig[],
): UseAnalyticsDataReturn {
  const {
    data: trendsResponse,
    isLoading: isTrendsLoading,
    error: trendsError,
  } = useFetch<ApiAnalyticsTrendsResponse>({
    url: trendsUrl,
    retry: false,
    refetchInterval: 30_000,
  })

  const analyticsData = useMemo<AnalyticsData[]>(() => {
    if (trendsResponse) {
      return trendsResponse.data.map(mapTrendPointToAnalyticsData)
    }
    return []
  }, [trendsResponse])

  const filteredData = useMemo<AnalyticsData[]>(() => {
    const { startDate, endDate, stationFilter, gradeFilter } = filters
    const start = startDate.length > 0 ? new Date(startDate) : null
    const end = endDate.length > 0 ? new Date(endDate) : null

    return analyticsData.filter((row) => {
      const rowDate = new Date(row.date)
      // AnalyticsData has no station field yet — filter is a no-op until the type is extended
      const normalizedStation = stationFilter.trim().toLowerCase()
      const matchesStation = normalizedStation.length === 0
      const matchesDate =
        (!start || rowDate >= start) &&
        (!end || rowDate <= end) &&
        matchesStation

      if (!matchesDate) return false
      if (gradeFilter === 'all') return true
      if (gradeFilter === 'A') return row.qualityA >= row.qualityB
      if (gradeFilter === 'B') return row.qualityB >= row.qualityC
      if (gradeFilter === 'C') return row.qualityC >= row.qualityD
      return row.qualityD > 0
    })
  }, [analyticsData, filters])

  const chartDataMap = useMemo<Record<string, AnalyticsData[]>>(
    () =>
      charts.reduce<Record<string, AnalyticsData[]>>((acc, chart) => {
        acc[chart.id] = aggregateAnalyticsByGranularity(filteredData, chart)
        return acc
      }, {}),
    [charts, filteredData],
  )

  const headlineMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { samples: 0, avgMoisture: 0, avgScore: 0 }
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

  return {
    analyticsData,
    filteredData,
    chartDataMap,
    headlineMetrics,
    isTrendsLoading,
    trendsError,
  }
}
