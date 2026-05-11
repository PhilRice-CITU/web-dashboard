import { useQuery } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type { ApiResultsListResponse } from '#/shared/api/contracts'

export function useDeviceResults(
  deviceId: string,
  page: number,
  pageSize = 20,
) {
  return useQuery<ApiResultsListResponse>({
    queryKey: ['device-results', deviceId, page, pageSize],
    queryFn: async () => {
      const res = await httpClient.get<ApiResultsListResponse>('/results', {
        params: { device_id: deviceId, page, page_size: pageSize },
      })
      return res.data
    },
    enabled: Boolean(deviceId),
    staleTime: 30_000,
  })
}
