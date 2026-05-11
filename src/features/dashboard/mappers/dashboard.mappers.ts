import type { ApiDevice, ApiDeviceEvent } from '#/shared/api/contracts'
import type { MapDevice } from '#/features/dashboard/types/dashboard.types'
import {
  PNS_GRADE_ORDER,
  isPositivePnsGrade,
  pnsGradeShortLabel,
} from '#/shared/lib/pnsGrade'
import { seededNumber, seededCoordinate } from '#/shared/lib/utils'
import type { LiveSignal, RiceGrade } from '../types/dashboard.types'

export function mapApiDeviceToMapDevice(
  device: ApiDevice,
  index: number,
): MapDevice {
  const status =
    device.status === 'offline'
      ? 'inactive'
      : device.status === 'maintenance'
        ? 'scanning'
        : 'active'

  return {
    id: device.id,
    name: device.display_name,
    group: 'Live Fleet',
    status,
    lastSeen: device.updated_at,
    samplesProcessed: 45 + (seededNumber(device.id, 0, 360) % 360),
    cpu: 0,
    latitude: seededCoordinate(device.id, 14.8, 16.1, index),
    longitude: seededCoordinate(device.id, 120.4, 121.6, index + 2),
    location: `Region ${device.region_id.slice(0, 8)}`,
  }
}

export function mapApiEventToLiveSignal(event: ApiDeviceEvent): LiveSignal {
  const level: LiveSignal['level'] =
    event.level === 'ERROR' ? 'warn' : event.level === 'WARN' ? 'warn' : 'info'

  return {
    level,
    title: event.device_id ? `${event.device_id} event` : 'System event',
    detail: event.message,
    timestamp: new Date(event.created_at).toLocaleTimeString(),
  }
}

export function buildRiceGradesData(
  dashboardGrades:
    | Array<{ name: string; value: number; share: number; status: string }>
    | undefined,
  analytics:
    | {
        total_samples: number
        grade_counts: Record<string, number>
      }
    | undefined,
): RiceGrade[] {
  if (dashboardGrades && dashboardGrades.length > 0) {
    return dashboardGrades.map((grade) => ({
      name: grade.name,
      value: `${grade.value.toLocaleString()} samples`,
      share: Math.round(grade.share),
      status:
        grade.status === 'negative'
          ? ('negative' as const)
          : ('positive' as const),
    }))
  }

  if (analytics) {
    const total = Math.max(analytics.total_samples, 1)
    return PNS_GRADE_ORDER.map((grade) => {
      const count = analytics.grade_counts[grade] ?? 0
      return {
        name: pnsGradeShortLabel(grade),
        value: `${count.toLocaleString()} samples`,
        share: Math.round((count / total) * 100),
        status: isPositivePnsGrade(grade)
          ? ('positive' as const)
          : ('negative' as const),
      }
    })
  }

  return PNS_GRADE_ORDER.map((grade) => ({
    name: pnsGradeShortLabel(grade),
    value: '0 samples',
    share: 0,
    status: isPositivePnsGrade(grade)
      ? ('positive' as const)
      : ('negative' as const),
  }))
}

export function getSignalBadgeClass(level: LiveSignal['level']): string {
  if (level === 'ok') {
    return 'border text-xs border-emerald-300 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 px-1'
  }
  if (level === 'warn') {
    return 'border text-xs border-amber-300 bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 px-1'
  }
  return 'border text-xs border-sky-300 bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 px-1'
}
