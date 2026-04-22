import { useEffect, useMemo, useState } from 'react'
import type { ApiDevice } from '#/api/contracts'
import { useFetch } from '#/hooks/useApi'
import { useDeviceEventsLiveInvalidation } from '#/hooks/useDeviceEventsLiveInvalidation'
import { mapApiDeviceToFleetDevice } from '../mappers/devices.mappers'
import type { FleetDevice } from '../types/devices.types'

export type UseDeviceFleetReturn = {
  devices: FleetDevice[]
  selectedDevice: FleetDevice | undefined
  selectedDeviceId: string
  setSelectedDeviceId: (id: string) => void
  isDevicesLoading: boolean
  devicesError: unknown
}

export function useDeviceFleet(): UseDeviceFleetReturn {
  useDeviceEventsLiveInvalidation()

  const [selectedDeviceId, setSelectedDeviceId] = useState('')

  const {
    data: deviceRows,
    isLoading: isDevicesLoading,
    error: devicesError,
  } = useFetch<ApiDevice[]>({
    url: '/devices',
    retry: false,
    refetchInterval: 10_000,
  })

  const devices = useMemo<FleetDevice[]>(
    () =>
      (deviceRows ?? []).map((device, index) =>
        mapApiDeviceToFleetDevice(device, index),
      ),
    [deviceRows],
  )

  const selectedDevice = devices.find(
    (device) => device.id === selectedDeviceId,
  )

  // Auto-select first device when list loads or selected device disappears
  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(devices[0].id)
      return
    }
    if (
      selectedDeviceId &&
      devices.length > 0 &&
      !devices.some((device) => device.id === selectedDeviceId)
    ) {
      setSelectedDeviceId(devices[0].id)
    }
  }, [devices, selectedDeviceId])

  return {
    devices,
    selectedDevice,
    selectedDeviceId,
    setSelectedDeviceId,
    isDevicesLoading,
    devicesError,
  }
}
