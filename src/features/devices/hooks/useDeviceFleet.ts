import { useEffect, useMemo, useState } from 'react'
import type { ApiDevice, ApiRegion } from '#/shared/api/contracts'
import { useFetch } from '#/shared/hooks/useApi'
import { useRegions } from '#/features/devices/hooks/useRegions'
import { mapApiDeviceToFleetDevice } from '../mappers/devices.mappers'
import type { FleetDevice } from '../types/devices.types'

export type UseDeviceFleetReturn = {
  devices: FleetDevice[]
  regions: ApiRegion[] | undefined
  selectedDevice: FleetDevice | undefined
  selectedDeviceId: string
  setSelectedDeviceId: (id: string) => void
  isDevicesLoading: boolean
  devicesError: unknown
}

export function useDeviceFleet(
  regionFilter?: string | null,
): UseDeviceFleetReturn {
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

  const { data: regions } = useRegions()

  const devices = useMemo<FleetDevice[]>(() => {
    const mapped = (deviceRows ?? []).map((device, index) =>
      mapApiDeviceToFleetDevice(device, index, regions),
    )
    return regionFilter
      ? mapped.filter((d) => d.regionId === regionFilter)
      : mapped
  }, [deviceRows, regions, regionFilter])

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
    regions,
    selectedDevice,
    selectedDeviceId,
    setSelectedDeviceId,
    isDevicesLoading,
    devicesError,
  }
}
