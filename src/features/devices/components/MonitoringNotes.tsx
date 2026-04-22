import { CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  formatLatency,
  formatLiveConnectionStatus,
} from '../mappers/devices.mappers'
import type { DeviceTelemetry, FleetDevice } from '../types/devices.types'
import type { ApiDeviceCommand } from '#/api/contracts'
import type { LiveMqttConnectionStatus } from '#/lib/liveMqttSse'

type Props = {
  selectedDevice: FleetDevice | undefined
  telemetry: DeviceTelemetry
  liveConnectionStatus: LiveMqttConnectionStatus
  latestCommand: ApiDeviceCommand | undefined
}

export function MonitoringNotes({
  selectedDevice,
  telemetry,
  liveConnectionStatus,
  latestCommand,
}: Props) {
  return (
    <div className="border-l border-border">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm">Monitoring Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>
          Last heartbeat:{' '}
          {selectedDevice
            ? new Date(selectedDevice.lastSeen).toLocaleString()
            : 'N/A'}
        </p>
        <p>
          Approx network latency: {formatLatency(telemetry.networkLatencyMs)}
        </p>
        <p>
          API event stream: {formatLiveConnectionStatus(liveConnectionStatus)}
        </p>
        <p>
          Total samples processed: {selectedDevice?.samplesProcessed ?? 'N/A'}
        </p>
        {latestCommand ? (
          <p>
            Latest command: {latestCommand.command} ({latestCommand.status})
          </p>
        ) : null}
      </CardContent>
    </div>
  )
}
