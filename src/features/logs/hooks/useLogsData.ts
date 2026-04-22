import { useEffect, useState } from 'react'
import type { ApiDeviceEventsListResponse } from '#/api/contracts'
import { useFetch } from '#/hooks/useApi'
import { supabase } from '#/lib/supabase'
import { mapApiEventToLogEvent } from '../mappers/logs.mappers'
import type { EventLevel, LogEvent } from '../types/logs.types'

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
    refetchInterval: 15_000,
  })

  const [liveEvents, setLiveEvents] = useState<LogEvent[]>([])

  // Seed from polling response
  useEffect(() => {
    if (!eventsResponse) return
    setLiveEvents(eventsResponse.data.map(mapApiEventToLogEvent))
  }, [eventsResponse])

  // Live append from SSE
  useEffect(() => {
    let source: EventSource | null = null
    let cancelled = false

    async function connect() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token || cancelled) return

      const apiBase =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
      const url = `${apiBase}/live/events?token=${encodeURIComponent(session.access_token)}`
      source = new EventSource(url)

      source.addEventListener('mqtt', (event) => {
        try {
          if (!(event instanceof MessageEvent)) return
          const parsed = JSON.parse(event.data) as {
            channel?: string
            device_id?: string
            payload?: {
              level?: EventLevel
              message?: string
              timestamp?: number
            }
          }
          if (parsed.channel !== 'logs' || !parsed.payload?.message) return

          const timestamp = parsed.payload.timestamp
            ? parsed.payload.timestamp * 1000
            : Date.now()

          const liveEvent: LogEvent = {
            time: new Date(timestamp).toLocaleTimeString(),
            createdAt: timestamp,
            device: parsed.device_id ?? 'SYSTEM',
            level: parsed.payload.level ?? 'INFO',
            message: parsed.payload.message,
          }
          setLiveEvents((current) => [liveEvent, ...current].slice(0, 250))
        } catch {
          // Ignore malformed payloads.
        }
      })
    }

    void connect()
    return () => {
      cancelled = true
      source?.close()
    }
  }, [])

  return { liveEvents, isEventsLoading, eventsError, refetch }
}
