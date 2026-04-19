import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { supabase } from '#/lib/supabase'

const MAX_RECONNECT_ATTEMPTS = 10
const MAX_BACKOFF_MS = 30_000

function getBackoffDelay(attempt: number): number {
  return Math.min(500 * 2 ** Math.max(attempt - 1, 0), MAX_BACKOFF_MS)
}

export function useDeviceEventsLiveInvalidation() {
  const queryClient = useQueryClient()

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false
    let reconnectAttempts = 0

    async function connect() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        return
      }

      const apiBase =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
      const websocketBase = apiBase.replace(/^http/, 'ws')

      socket = new WebSocket(
        `${websocketBase}/device-events/ws?token=${encodeURIComponent(session.access_token)}`,
      )

      socket.onopen = () => {
        reconnectAttempts = 0
      }

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as {
            type?: string
          }

          if (parsed.type !== 'device-event') {
            return
          }

          queryClient.invalidateQueries({ queryKey: ['/devices'] })
        } catch {
          // Ignore malformed websocket payloads.
        }
      }

      socket.onclose = () => {
        if (cancelled) {
          return
        }

        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          return
        }

        const nextAttempt = reconnectAttempts + 1
        reconnectAttempts = nextAttempt
        const delayMs = getBackoffDelay(nextAttempt)
        reconnectTimer = setTimeout(() => {
          void connect()
        }, delayMs)
      }
    }

    void connect()

    return () => {
      cancelled = true
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
      socket?.close()
    }
  }, [queryClient])
}
