import { useQuery } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type {
  ApiResultsListResponse,
  ApiDashboardSummary,
} from '#/shared/api/contracts'

export type ResultsFilters = {
  grade?: string
  deviceId?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
}

export function useResultsList(filters: ResultsFilters = {}) {
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    page_size: 50,
  }
  if (filters.deviceId) params.device_id = filters.deviceId
  if (filters.startDate) params.start_date = filters.startDate
  if (filters.endDate) params.end_date = filters.endDate

  return useQuery({
    queryKey: ['results', params],
    queryFn: async () => {
      const { data } = await httpClient.get<ApiResultsListResponse>(
        '/results',
        { params },
      )
      return data
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await httpClient.get<ApiDashboardSummary>(
        '/analytics/dashboard',
      )
      return data
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
