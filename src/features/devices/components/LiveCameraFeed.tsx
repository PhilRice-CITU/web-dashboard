import { Camera, Power, RefreshCw, RotateCcw } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  formatLatency,
  formatLiveConnectionStatus,
} from '../mappers/devices.mappers'
import type {
  DeviceAction,
  FleetDevice,
  DeviceTelemetry,
} from '../types/devices.types'
import type { LiveMqttConnectionStatus } from '#/lib/liveMqttSse'

type Props = {
  selectedDevice: FleetDevice | undefined
  telemetry: DeviceTelemetry
  liveFrameSrc: string | null
  activeStreamSessionId: string | null
  liveConnectionStatus: LiveMqttConnectionStatus
  actionState: Record<string, string>
  isDisconnectPending: boolean
  onStartStream: () => void
  onStopStream: () => void
  onDeviceAction: (action: DeviceAction) => void
  onDisconnect: () => void
}

export function LiveCameraFeed({
  selectedDevice,
  telemetry,
  liveFrameSrc,
  activeStreamSessionId,
  liveConnectionStatus,
  actionState,
  isDisconnectPending,
  onStartStream,
  onStopStream,
  onDeviceAction,
  onDisconnect,
}: Props) {
  return (
    <div className="col-span-2 border-none border-r border-border py-4">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-sm">Live Camera Feed</CardTitle>
        <CardDescription>
          MQTT relayed live preview for selected device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative h-64 overflow-hidden rounded-md border border-border bg-black">
          {liveFrameSrc ? (
            <img
              src={liveFrameSrc}
              alt="Live camera frame"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937,#020617_65%)]" />
          )}
          <div className="absolute bottom-2 left-2 rounded bg-black/65 px-2 py-1 text-xs text-slate-100">
            {activeStreamSessionId ? 'LIVE' : 'IDLE'} •{' '}
            {formatLiveConnectionStatus(liveConnectionStatus)} •{' '}
            {selectedDevice?.id ?? 'N/A'} •{' '}
            {formatLatency(telemetry.networkLatencyMs)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onStartStream}
            disabled={!selectedDevice || Boolean(activeStreamSessionId)}
          >
            Start Stream
          </Button>
          <Button
            variant="outline"
            onClick={onStopStream}
            disabled={!selectedDevice || !activeStreamSessionId}
          >
            Stop Stream
          </Button>
          <Button variant="outline" onClick={() => onDeviceAction('capture')}>
            <Camera className="mr-2 size-4" />
            Capture Photo
          </Button>
          <Button
            variant="outline"
            onClick={() => onDeviceAction('restart-app')}
          >
            <RefreshCw className="mr-2 size-4" />
            Restart App
          </Button>
          <Button
            variant="outline"
            onClick={() => onDeviceAction('restart-device')}
          >
            <RotateCcw className="mr-2 size-4" />
            Restart Device
          </Button>
          <Button
            variant="outline"
            className="text-rose-700"
            onClick={() => onDeviceAction('shutdown-device')}
          >
            <Power className="mr-2 size-4" />
            Turn Off Device
          </Button>
          <Button
            variant="outline"
            className="text-rose-700"
            onClick={onDisconnect}
            disabled={isDisconnectPending}
          >
            <Power className="mr-2 size-4" />
            Disconnect Device
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {actionState[selectedDevice?.id ?? ''] ??
            'No control action sent yet.'}
        </p>
      </CardContent>
    </div>
  )
}
