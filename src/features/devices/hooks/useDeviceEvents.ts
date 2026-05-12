import { useQuery } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type { ApiDeviceEventsListResponse } from '#/shared/api/contracts'

export function useDeviceEvents(deviceId: string) {
  return useQuery({
    queryKey: ['device-events', deviceId],
    queryFn: async () => {
      const { data } = await httpClient.get<ApiDeviceEventsListResponse>(
        '/device-events',
        { params: { device_id: deviceId, page: 1, page_size: 100 } },
      )
      return data
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}
