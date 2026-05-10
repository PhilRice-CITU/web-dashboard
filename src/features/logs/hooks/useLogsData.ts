import { useMemo } from 'react'
import type { ApiDeviceEventsListResponse } from '#/shared/api/contracts'
import { useFetch } from '#/shared/hooks/useApi'
import { mapApiEventToLogEvent } from '../mappers/logs.mappers'
import type { LogEvent } from '../types/logs.types'

export type UseLogsDataReturn = {
  liveEvents: LogEvent[]
  isEventsLoading: boolean
  eventsError: unknown
  refetch: () => void
}

export function useLogsData(): UseLogsDataReturn {
  const {
    data: eventsResponse,
    isLoading: isEventsLoading,
    error: eventsError,
    refetch,
  } = useFetch<ApiDeviceEventsListResponse>({
    url: '/device-events?page=1&page_size=200',
    retry: false,
    refetchInterval: 30_000,
  })

  const liveEvents = useMemo<LogEvent[]>(
    () => eventsResponse?.data.map(mapApiEventToLogEvent) ?? [],
    [eventsResponse],
  )

  return { liveEvents, isEventsLoading, eventsError, refetch }
}
