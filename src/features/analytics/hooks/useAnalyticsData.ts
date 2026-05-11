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
  headlineMetrics: {
    samples: number
    avgBrokenGrains: number
    premiumShare: number
  }
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
      if (gradeFilter === 'Premium') return row.gradePremium > 0
      if (gradeFilter === 'Grade no. 1') return row.grade1 > 0
      if (gradeFilter === 'Grade no. 2') return row.grade2 > 0
      if (gradeFilter === 'Grade no. 3') return row.grade3 > 0
      if (gradeFilter === 'Grade no. 4') return row.grade4 > 0
      if (gradeFilter === 'Grade no. 5') return row.grade5 > 0
      if (gradeFilter === 'Off-Grade') return row.gradeOffGrade > 0
      return true
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
      return { samples: 0, avgBrokenGrains: 0, premiumShare: 0 }
    }
    const samples = filteredData.reduce(
      (total, row) => total + row.totalSamples,
      0,
    )
    const avgBrokenGrains =
      filteredData.reduce((total, row) => total + row.avgBrokenGrains, 0) /
      filteredData.length
    const premiumCount = filteredData.reduce(
      (total, row) => total + row.gradePremium + row.grade1,
      0,
    )
    const premiumShare = samples > 0 ? (premiumCount / samples) * 100 : 0
    return {
      samples,
      avgBrokenGrains: Number(avgBrokenGrains.toFixed(2)),
      premiumShare: Number(premiumShare.toFixed(1)),
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
