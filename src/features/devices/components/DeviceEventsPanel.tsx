import { cn } from '#/shared/lib/utils'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { useDeviceEvents } from '../hooks/useDeviceEvents'
import type { ApiDeviceEvent } from '#/shared/api/contracts'

type Props = { deviceId: string }

const LEVEL_CLASS: Record<ApiDeviceEvent['level'], string> = {
  INFO: 'bg-sky-500/10 text-sky-700',
  WARN: 'bg-amber-500/10 text-amber-700',
  ERROR: 'bg-rose-500/10 text-rose-700',
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function DeviceEventsPanel({ deviceId }: Props) {
  const { data, isLoading, error } = useDeviceEvents(deviceId)
  const events = data?.data ?? []

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">Failed to load device events.</p>
    )
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No events recorded for this device.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2 text-xs"
        >
          <span
            className={cn(
              'shrink-0 rounded px-1.5 py-0.5 font-mono font-semibold',
              LEVEL_CLASS[ev.level],
            )}
          >
            {ev.level}
          </span>
          <span className="min-w-0 flex-1 text-foreground">{ev.message}</span>
          <span className="shrink-0 text-muted-foreground">
            {formatTs(ev.created_at)}
          </span>
        </div>
      ))}
    </div>
  )
}
