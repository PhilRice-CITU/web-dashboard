import { useQuery } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type { ApiAnalyticsSummary } from '#/shared/api/contracts'

export function useDeviceAnalytics(deviceId: string) {
  return useQuery<ApiAnalyticsSummary>({
    queryKey: ['device-analytics', deviceId],
    queryFn: async () => {
      const res = await httpClient.get<ApiAnalyticsSummary>('/analytics', {
        params: { device_id: deviceId },
      })
      return res.data
    },
    enabled: Boolean(deviceId),
    staleTime: 60_000,
  })
}
