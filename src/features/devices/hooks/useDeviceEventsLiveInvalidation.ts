import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { subscribeToLiveMqttEvents } from '#/shared/lib/realtime/liveMqttSse'

export function useDeviceEventsLiveInvalidation() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = subscribeToLiveMqttEvents((parsed) => {
      if (!parsed.channel) {
        return
      }

      if (parsed.channel === 'telemetry' || parsed.channel === 'presence') {
        queryClient.invalidateQueries({ queryKey: ['/devices'] })
        return
      }
      if (parsed.channel === 'logs') {
        queryClient.invalidateQueries({
          queryKey: ['/device-events?page=1&page_size=6'],
        })
        queryClient.invalidateQueries({
          queryKey: ['/device-events?page=1&page_size=200'],
        })
        return
      }
      if (parsed.channel === 'acks') {
        queryClient.invalidateQueries({ queryKey: ['/devices'] })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient])
}
