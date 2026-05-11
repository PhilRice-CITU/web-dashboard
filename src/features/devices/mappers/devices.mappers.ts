import type { ApiDevice, ApiRegion } from '#/shared/api/contracts'
import type { DeviceStatus, FleetDevice } from '../types/devices.types'

export function mapApiDeviceToFleetDevice(
  device: ApiDevice,
  _index: number,
  regions?: ApiRegion[],
): FleetDevice {
  const regionName =
    regions?.find((r) => r.id === device.region_id)?.name ?? 'Unknown region'
  return {
    id: device.id,
    name: device.display_name,
    status: normalizeStatus(device.status),
    regionId: device.region_id,
    regionName,
    lastSeen: device.last_seen ?? null,
    createdAt: device.created_at,
  }
}

function normalizeStatus(status: ApiDevice['status']): DeviceStatus {
  if (status === 'active') return 'active'
  if (status === 'maintenance') return 'maintenance'
  return 'inactive'
}

export function getStatusBadgeClass(status: string): string {
  if (status === 'active') return 'bg-emerald-500/15 text-emerald-700'
  if (status === 'maintenance') return 'bg-amber-500/15 text-amber-700'
  return 'bg-slate-500/15 text-slate-700'
}
