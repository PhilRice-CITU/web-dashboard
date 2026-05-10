import { CardContent, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { formatLatency } from '../mappers/devices.mappers'
import type { DeviceTelemetry, FleetDevice } from '../types/devices.types'

type Props = {
  selectedDevice: FleetDevice | undefined
  telemetry: DeviceTelemetry
}

export function MonitoringNotes({ selectedDevice, telemetry }: Props) {
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
          Total samples processed: {selectedDevice?.samplesProcessed ?? 'N/A'}
        </p>
      </CardContent>
    </div>
  )
}
