import type { ApiDeviceEvent } from '#/shared/api/contracts'
import type { EventLevel, LogEvent } from '../types/logs.types'

export function mapApiEventToLogEvent(event: ApiDeviceEvent): LogEvent {
  const createdAt = new Date(event.created_at).getTime()
  return {
    time: new Date(createdAt).toLocaleTimeString(),
    createdAt,
    device: event.device_id ?? 'SYSTEM',
    level: event.level,
    message: event.message,
  }
}

export function getLevelBadgeClassName(level: EventLevel): string {
  if (level === 'ERROR') return 'bg-rose-500/15 text-rose-700'
  if (level === 'WARN') return 'bg-amber-500/15 text-amber-700'
  return 'bg-sky-500/15 text-sky-700'
}
