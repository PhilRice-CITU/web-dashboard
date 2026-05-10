import { ChevronsRight } from 'lucide-react'
import { Badge } from '#/shared/components/ui/badge'
import { Button } from '#/shared/components/ui/button'
import {
  getStatusBadgeClass,
  getDeviceTelemetry,
} from '../mappers/devices.mappers'
import { TelemetryGrid } from './TelemetryGrid'
import { MonitoringNotes } from './MonitoringNotes'
import type { FleetDevice } from '../types/devices.types'

type Props = {
  selectedDevice: FleetDevice | undefined
  isDisconnectPending: boolean
  onCollapse: () => void
  onDisconnect: () => void
}

export function DeviceDetailPanel({
  selectedDevice,
  isDisconnectPending,
  onCollapse,
  onDisconnect,
}: Props) {
  const telemetry = getDeviceTelemetry(selectedDevice)

  return (
    <div className="bg-background">
      <div className="space-y-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
          <div>
            <h3 className="text-base font-semibold">
              {selectedDevice?.name ?? 'No device selected'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedDevice?.id ?? 'N/A'} •{' '}
              {selectedDevice?.group ?? 'Ungrouped'} •{' '}
              {selectedDevice?.location ?? 'Unknown'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={getStatusBadgeClass(
                selectedDevice?.status ?? 'inactive',
              )}
            >
              {selectedDevice?.status ?? 'inactive'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              disabled={isDisconnectPending || !selectedDevice}
            >
              Disconnect
            </Button>
            <Button variant="outline" size="sm" onClick={onCollapse}>
              <ChevronsRight className="mr-1 size-3.5" />
              Collapse
            </Button>
          </div>
        </div>

        <TelemetryGrid telemetry={telemetry} />

        <div className="grid grid-cols-1 gap-3 border-t border-border px-4">
          <MonitoringNotes
            selectedDevice={selectedDevice}
            telemetry={telemetry}
          />
        </div>
      </div>
    </div>
  )
}
