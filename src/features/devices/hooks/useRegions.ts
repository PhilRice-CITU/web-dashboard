import { useQuery } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type { ApiRegion } from '#/shared/api/contracts'

export function useRegions() {
  return useQuery<ApiRegion[]>({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await httpClient.get<ApiRegion[]>('/regions')
      return res.data
    },
    staleTime: Infinity,
  })
}
