import type { FleetDevice } from '#/features/devices/types/devices.types'
import { cn } from '#/shared/lib/utils'

type Props = {
  devices: FleetDevice[]
  value: string | null
  onChange: (deviceId: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export function DeviceSelector({
  devices,
  value,
  onChange,
  disabled,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="h-9 w-full animate-pulse rounded-md border border-border bg-muted/50" />
    )
  }

  if (devices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No devices provisioned. Provision a device on the Devices page first.
      </p>
    )
  }

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <option value="" disabled>
        Select a device…
      </option>
      {devices.map((device) => (
        <option key={device.id} value={device.id}>
          {device.name} — {device.regionName} ({device.id.slice(0, 8)}…)
        </option>
      ))}
    </select>
  )
}
