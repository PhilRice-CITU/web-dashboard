import type { ReactNode } from 'react'
import { Thermometer } from 'lucide-react'
import {
  formatPercent,
  formatTemperature,
  formatInteger,
} from '../mappers/devices.mappers'
import type { DeviceTelemetry } from '../types/devices.types'

type Props = {
  telemetry: DeviceTelemetry
}

function TelemetryTile({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string
  value: string
  icon?: ReactNode
  valueClassName?: string
}) {
  return (
    <div className="space-y-1 rounded-md border border-border bg-muted/25 p-3">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p
        className={`font-mono text-lg font-semibold text-foreground ${valueClassName ?? ''}`}
      >
        {value}
      </p>
    </div>
  )
}

export function TelemetryGrid({ telemetry }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 px-4">
      <TelemetryTile label="CPU" value={formatPercent(telemetry.cpuPercent)} />
      <TelemetryTile
        label="Memory"
        value={formatPercent(telemetry.memoryPercent)}
      />
      <TelemetryTile
        label="Storage"
        value={formatPercent(telemetry.storagePercent)}
      />
      <TelemetryTile
        label="Temperature"
        value={formatTemperature(telemetry.temperatureCelsius)}
        icon={<Thermometer className="size-3.5" />}
      />
      <TelemetryTile
        label="Queue Depth"
        value={formatInteger(telemetry.queueDepth)}
      />
      <TelemetryTile
        label="Camera"
        value={telemetry.cameraStatus}
        valueClassName={
          telemetry.cameraStatus === 'online'
            ? 'text-emerald-700'
            : 'text-slate-600'
        }
      />
    </div>
  )
}
