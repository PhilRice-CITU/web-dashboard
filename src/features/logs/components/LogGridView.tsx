import { DeviceTerminal } from './DeviceTerminal'
import type { LogEvent } from '../types/logs.types'

type DeviceGroup = { device: string; events: LogEvent[] }

type Props = {
  groups: DeviceGroup[]
  onExpand: (device: string) => void
}

export function LogGridView({ groups, onExpand }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.device}
            className="min-h-72 overflow-hidden rounded-lg border border-border bg-muted/20 lg:min-h-88"
          >
            <DeviceTerminal
              device={group.device}
              events={group.events}
              onExpand={() => onExpand(group.device)}
            />
          </div>
        ))}
      </div>
      {groups.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No device logs to display.
        </p>
      )}
    </div>
  )
}
