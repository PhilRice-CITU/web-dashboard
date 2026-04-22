import { ChevronsRight } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  getStatusBadgeClass,
  getDeviceTelemetry,
} from '../mappers/devices.mappers'
import { TelemetryGrid } from './TelemetryGrid'
import { LiveCameraFeed } from './LiveCameraFeed'
import { MonitoringNotes } from './MonitoringNotes'
import type { DeviceAction, FleetDevice } from '../types/devices.types'
import type { ApiDeviceCommand } from '#/api/contracts'
import type { LiveMqttConnectionStatus } from '#/lib/liveMqttSse'

type Props = {
  selectedDevice: FleetDevice | undefined
  commandHistory: ApiDeviceCommand[]
  latestCommand: ApiDeviceCommand | undefined
  liveFrameSrc: string | null
  activeStreamSessionId: string | null
  liveConnectionStatus: LiveMqttConnectionStatus
  actionState: Record<string, string>
  isDisconnectPending: boolean
  onCollapse: () => void
  onStartStream: () => void
  onStopStream: () => void
  onDeviceAction: (action: DeviceAction) => void
  onDisconnect: () => void
}

export function DeviceDetailPanel({
  selectedDevice,
  latestCommand,
  liveFrameSrc,
  activeStreamSessionId,
  liveConnectionStatus,
  actionState,
  isDisconnectPending,
  onCollapse,
  onStartStream,
  onStopStream,
  onDeviceAction,
  onDisconnect,
}: Props) {
  const telemetry = getDeviceTelemetry(selectedDevice)

  return (
    <div className="bg-background">
      <div className="space-y-4 p-0">
        {/* Header */}
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
            <Button variant="outline" size="sm" onClick={onCollapse}>
              <ChevronsRight className="mr-1 size-3.5" />
              Collapse
            </Button>
          </div>
        </div>

        {/* Telemetry tiles */}
        <TelemetryGrid telemetry={telemetry} />

        {/* Camera feed + monitoring notes */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 border-t border-border px-4">
          <LiveCameraFeed
            selectedDevice={selectedDevice}
            telemetry={telemetry}
            liveFrameSrc={liveFrameSrc}
            activeStreamSessionId={activeStreamSessionId}
            liveConnectionStatus={liveConnectionStatus}
            actionState={actionState}
            isDisconnectPending={isDisconnectPending}
            onStartStream={onStartStream}
            onStopStream={onStopStream}
            onDeviceAction={onDeviceAction}
            onDisconnect={onDisconnect}
          />
          <MonitoringNotes
            selectedDevice={selectedDevice}
            telemetry={telemetry}
            liveConnectionStatus={liveConnectionStatus}
            latestCommand={latestCommand}
          />
        </div>
      </div>
    </div>
  )
}
