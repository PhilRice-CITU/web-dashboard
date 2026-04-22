import { useEffect, useState } from 'react'
import { httpClient } from '#/api/client'
import {
  subscribeToLiveMqttEvents,
  subscribeToLiveMqttStatus,
} from '#/lib/liveMqttSse'
import type { LiveMqttConnectionStatus } from '#/lib/liveMqttSse'
import type { FleetDevice } from '../types/devices.types'

const CAMERA_STREAM_DEFAULT_FPS = Math.max(
  1,
  Math.min(5, Number(import.meta.env.VITE_CAMERA_STREAM_DEFAULT_FPS ?? 2)),
)
const CAMERA_STREAM_DEFAULT_DURATION_SECONDS = Math.max(
  5,
  Math.min(
    120,
    Number(import.meta.env.VITE_CAMERA_STREAM_DEFAULT_DURATION_SECONDS ?? 45),
  ),
)

export type UseDeviceStreamReturn = {
  activeStreamSessionId: string | null
  liveFrameSrc: string | null
  liveConnectionStatus: LiveMqttConnectionStatus
  handleStartCameraStream: () => Promise<void>
  handleStopCameraStream: () => Promise<void>
}

export function useDeviceStream(
  selectedDevice: FleetDevice | undefined,
  setActionState: (
    fn: (current: Record<string, string>) => Record<string, string>,
  ) => void,
): UseDeviceStreamReturn {
  const [activeStreamSessionId, setActiveStreamSessionId] = useState<
    string | null
  >(null)
  const [liveFrameSrc, setLiveFrameSrc] = useState<string | null>(null)
  const [liveConnectionStatus, setLiveConnectionStatus] =
    useState<LiveMqttConnectionStatus>('idle')

  // Subscribe to MQTT connection status
  useEffect(() => {
    const unsubscribe = subscribeToLiveMqttStatus(setLiveConnectionStatus)
    return () => {
      unsubscribe()
    }
  }, [])

  // Subscribe to camera frame events
  useEffect(() => {
    const unsubscribe = subscribeToLiveMqttEvents((parsed) => {
      if (parsed.channel !== 'camera' || !selectedDevice?.id) return
      if (parsed.device_id !== selectedDevice.id) return

      const sessionId = parsed.payload?.session_id
      if (!sessionId || sessionId !== activeStreamSessionId) return

      const frameBase64 = parsed.payload?.frame_base64
      const contentType = parsed.payload?.content_type || 'image/jpeg'
      if (!frameBase64) return

      setLiveFrameSrc(`data:${contentType};base64,${frameBase64}`)
    })
    return () => {
      unsubscribe()
    }
  }, [selectedDevice?.id, activeStreamSessionId])

  // Reset stream state when device changes
  useEffect(() => {
    setActiveStreamSessionId(null)
    setLiveFrameSrc(null)
  }, [selectedDevice?.id])

  const handleStartCameraStream = async () => {
    if (!selectedDevice) return
    try {
      const response = await httpClient.post<{
        session_id: string
        device_id: string
      }>(
        `/devices/${selectedDevice.id}/stream/start?fps=${CAMERA_STREAM_DEFAULT_FPS}&duration_seconds=${CAMERA_STREAM_DEFAULT_DURATION_SECONDS}`,
      )
      setActiveStreamSessionId(response.data.session_id)
      setActionState((current) => ({
        ...current,
        [selectedDevice.id]: `Live stream started • ${new Date().toLocaleTimeString()}`,
      }))
    } catch {
      setActionState((current) => ({
        ...current,
        [selectedDevice.id]: `Failed to start stream • ${new Date().toLocaleTimeString()}`,
      }))
    }
  }

  const handleStopCameraStream = async () => {
    if (!selectedDevice) return
    try {
      const query = activeStreamSessionId
        ? `?session_id=${encodeURIComponent(activeStreamSessionId)}`
        : ''
      await httpClient.post(`/devices/${selectedDevice.id}/stream/stop${query}`)
    } catch {
      // Ignore stop errors and clear UI state anyway.
    }
    setActiveStreamSessionId(null)
    setLiveFrameSrc(null)
    setActionState((current) => ({
      ...current,
      [selectedDevice.id]: `Live stream stopped • ${new Date().toLocaleTimeString()}`,
    }))
  }

  return {
    activeStreamSessionId,
    liveFrameSrc,
    liveConnectionStatus,
    handleStartCameraStream,
    handleStopCameraStream,
  }
}
