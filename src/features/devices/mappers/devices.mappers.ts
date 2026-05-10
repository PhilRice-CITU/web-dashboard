import type { ApiDevice, ApiRegion } from '#/shared/api/contracts'
import { seededCoordinate } from '#/shared/lib/utils'
import type { FleetDevice, DeviceTelemetry } from '../types/devices.types'

export function mapApiDeviceToFleetDevice(
  device: ApiDevice,
  index: number,
  regions?: ApiRegion[],
): FleetDevice {
  return {
    id: device.id,
    name: device.display_name,
    group: 'Live Fleet',
    status:
      device.status === 'offline'
        ? 'inactive'
        : device.status === 'maintenance'
          ? 'scanning'
          : 'active',
    lastSeen: device.updated_at,
    samplesProcessed: null,
    cpuPercent: device.cpu_percent,
    memoryPercent: device.memory_percent,
    storagePercent: device.storage_percent,
    temperatureCelsius: device.temperature_celsius,
    queueDepth: device.queue_depth,
    latitude: seededCoordinate(device.id, 14.8, 16.1, index),
    longitude: seededCoordinate(device.id, 120.4, 121.6, index + 4),
    location:
      regions?.find((r) => r.id === device.region_id)?.name ?? 'Unknown Region',
    regionId: device.region_id,
  }
}

export function getDeviceTelemetry(
  device: FleetDevice | undefined,
): DeviceTelemetry {
  if (!device) {
    return {
      cpuPercent: null,
      memoryPercent: null,
      storagePercent: null,
      temperatureCelsius: null,
      queueDepth: null,
      cameraStatus: 'offline',
      networkLatencyMs: null,
    }
  }
  return {
    cpuPercent: device.cpuPercent,
    memoryPercent: device.memoryPercent,
    storagePercent: device.storagePercent,
    temperatureCelsius: device.temperatureCelsius,
    queueDepth: device.queueDepth,
    cameraStatus: device.status === 'inactive' ? 'offline' : 'online',
    networkLatencyMs: null,
  }
}

export function getStatusBadgeClass(
  status: 'inactive' | 'scanning' | 'active',
): string {
  if (status === 'active') return 'bg-emerald-500/15 text-emerald-700'
  if (status === 'scanning') return 'bg-amber-500/15 text-amber-700'
  return 'bg-slate-500/15 text-slate-700'
}

export function formatPercent(value: number | null): string {
  if (value === null) return 'N/A'
  return `${value.toFixed(1)}%`
}

export function formatTemperature(value: number | null): string {
  if (value === null) return 'N/A'
  return `${value.toFixed(1)} C`
}

export function formatInteger(value: number | null): string {
  if (value === null) return 'N/A'
  return String(value)
}

export function formatLatency(value: number | null): string {
  if (value === null) return 'N/A'
  return `${value}ms`
}
