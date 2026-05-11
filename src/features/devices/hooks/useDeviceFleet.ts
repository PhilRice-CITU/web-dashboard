import { useMemo } from 'react'
import type { ApiDevice, ApiRegion } from '#/shared/api/contracts'
import { useFetch } from '#/shared/hooks/useApi'
import { useRegions } from '#/features/devices/hooks/useRegions'
import { mapApiDeviceToFleetDevice } from '../mappers/devices.mappers'
import type { FleetDevice } from '../types/devices.types'

export type UseDeviceFleetReturn = {
  devices: FleetDevice[]
  regions: ApiRegion[] | undefined
  isDevicesLoading: boolean
  devicesError: unknown
}

export function useDeviceFleet(
  regionFilter?: string | null,
): UseDeviceFleetReturn {
  const {
    data: deviceRows,
    isLoading: isDevicesLoading,
    error: devicesError,
  } = useFetch<ApiDevice[]>({
    url: '/devices',
    retry: false,
    refetchInterval: 30_000,
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

  return { devices, regions, isDevicesLoading, devicesError }
}
