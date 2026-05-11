import { useMemo } from 'react'
import type { MapDevice } from '#/features/dashboard/types/dashboard.types'
import type {
  ApiAnalyticsSummary,
  ApiDashboardSummary,
  ApiDevice,
  ApiDeviceEventsListResponse,
} from '#/shared/api/contracts'
import { useFetch } from '#/shared/hooks/useApi'
import {
  mapApiDeviceToMapDevice,
  mapApiEventToLiveSignal,
  buildRiceGradesData,
} from '../mappers/dashboard.mappers'
import type {
  DashboardSummary,
  LiveSignal,
  RiceGrade,
} from '../types/dashboard.types'

export type UseDashboardDataReturn = {
  devices: MapDevice[]
  summary: DashboardSummary
  liveSignalsData: LiveSignal[]
  riceGradesData: RiceGrade[]
}

export function useDashboardData(): UseDashboardDataReturn {
  const { data: devicesResponse } = useFetch<ApiDevice[]>({
    url: '/devices',
    retry: false,
    refetchInterval: 10_000,
  })

  const { data: analyticsResponse } = useFetch<ApiAnalyticsSummary>({
    url: '/analytics',
    retry: false,
    refetchInterval: 30_000,
  })

  const { data: dashboardResponse } = useFetch<ApiDashboardSummary>({
    url: '/analytics/dashboard',
    retry: false,
    refetchInterval: 30_000,
  })

  const { data: eventsResponse } = useFetch<ApiDeviceEventsListResponse>({
    url: '/device-events?page=1&page_size=6',
    retry: false,
    refetchInterval: 10_000,
  })

  const devices = useMemo<MapDevice[]>(() => {
    if (!devicesResponse || devicesResponse.length === 0) return []
    return devicesResponse.map((device, index) =>
      mapApiDeviceToMapDevice(device, index),
    )
  }, [devicesResponse])

  const summary = useMemo<DashboardSummary>(() => {
    const totalDevices = dashboardResponse?.total_devices ?? devices.length
    const onlineDevices =
      dashboardResponse?.online_devices ??
      devices.filter((device) => device.status !== 'inactive').length

    return {
      totalSamples: dashboardResponse?.scans_processed_today ?? 0,
      onlineDevices,
      totalDevices,
      avgBrokenGrainPercentage:
        dashboardResponse?.factor_averages_today.broken ??
        analyticsResponse?.factor_averages.broken ??
        0,
    }
  }, [analyticsResponse, dashboardResponse, devices])

  const liveSignalsData = useMemo<LiveSignal[]>(() => {
    if (!eventsResponse?.data || eventsResponse.data.length === 0) return []
    return eventsResponse.data.map(mapApiEventToLiveSignal)
  }, [eventsResponse])

  const riceGradesData = useMemo<RiceGrade[]>(
    () =>
      buildRiceGradesData(
        dashboardResponse?.grade_distribution,
        analyticsResponse ?? undefined,
      ),
    [analyticsResponse, dashboardResponse],
  )

  return {
    devices,
    summary,
    liveSignalsData,
    riceGradesData,
  }
}
