import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  formatPercent,
  formatTemperature,
  formatInteger,
  formatLatency,
  getStatusBadgeClass,
  getDeviceTelemetry,
} from '../mappers/devices.mappers'
import type { FleetDevice } from '../types/devices.types'

type Props = {
  devices: FleetDevice[]
  selectedDeviceId: string
  isRightPanelCollapsed: boolean
  isDevicesLoading: boolean
  devicesError: unknown
  onSelectDevice: (id: string) => void
  onExpandDevice: (id: string) => void
}

export function DeviceListPanel({
  devices,
  selectedDeviceId,
  isRightPanelCollapsed,
  isDevicesLoading,
  devicesError,
  onSelectDevice,
  onExpandDevice,
}: Props) {
  return (
    <div className="border-b border-border xl:border-r xl:border-b-0">
      <div className="border-b border-border px-4 py-3 md:px-5">
        <h2 className="text-base font-semibold">Devices List</h2>
        <p className="text-sm text-muted-foreground">
          {isRightPanelCollapsed
            ? 'Right panel is collapsed. Expanded telemetry is shown in this list.'
            : 'Select a device to view telemetry, live feed, and controls.'}
        </p>
      </div>

      <div className="divide-y divide-border">
        {!isDevicesLoading && devicesError ? (
          <div className="px-4 py-3 text-sm text-rose-700">
            Failed to load devices from API.
          </div>
        ) : null}

        {!isDevicesLoading && !devicesError && devices.length === 0 ? (
          <div className="px-4 py-4 text-sm text-muted-foreground">
            No device connected yet. Add a device to start receiving telemetry
            and commands.
          </div>
        ) : null}

        {isRightPanelCollapsed ? (
          <div className="grid grid-cols-[2.1fr_1.2fr_repeat(7,minmax(0,1fr))_auto] gap-2 border-b border-border bg-muted/40 px-4 py-2 text-[11px] font-medium tracking-wide text-muted-foreground md:px-5">
            <span>DEVICE</span>
            <span>STATUS</span>
            <span>CPU</span>
            <span>TEMP</span>
            <span>MEM</span>
            <span>STO</span>
            <span>QUEUE</span>
            <span>CAM</span>
            <span>LAT</span>
            <span>ACTION</span>
          </div>
        ) : null}

        {devices.map((device) => {
          const rowTelemetry = getDeviceTelemetry(device)
          const isSelected = selectedDeviceId === device.id

          return (
            <div
              key={device.id}
              onClick={() => onSelectDevice(device.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectDevice(device.id)
                }
              }}
              role="button"
              tabIndex={0}
              className={`w-full px-4 py-3 text-left transition hover:bg-muted/50 md:px-5 ${
                isSelected ? 'bg-muted/70' : 'bg-background'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {isRightPanelCollapsed ? (
                  <div />
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {device.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {device.id} • {device.location}
                    </p>
                  </div>
                )}
                {!isRightPanelCollapsed && (
                  <Badge className={getStatusBadgeClass(device.status)}>
                    {device.status}
                  </Badge>
                )}
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                {isRightPanelCollapsed ? (
                  <div className="grid grid-cols-[2.1fr_1.2fr_repeat(7,minmax(0,1fr))_auto] items-center gap-2 rounded-sm bg-muted/20 px-2 py-1 font-mono text-[11px] text-foreground/90">
                    <span className="font-sans leading-tight text-foreground">
                      <span className="block text-sm font-semibold">
                        {device.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {device.id} • {device.location}
                      </span>
                    </span>
                    <span>
                      <Badge className={getStatusBadgeClass(device.status)}>
                        {device.status}
                      </Badge>
                    </span>
                    <span>{formatPercent(device.cpuPercent)}</span>
                    <span>
                      {formatTemperature(rowTelemetry.temperatureCelsius)}
                    </span>
                    <span>{formatPercent(rowTelemetry.memoryPercent)}</span>
                    <span>{formatPercent(rowTelemetry.storagePercent)}</span>
                    <span>{formatInteger(rowTelemetry.queueDepth)}</span>
                    <span>{rowTelemetry.cameraStatus}</span>
                    <span>{formatLatency(rowTelemetry.networkLatencyMs)}</span>
                    <span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[11px]"
                        onClick={(event) => {
                          event.stopPropagation()
                          onExpandDevice(device.id)
                        }}
                      >
                        View
                      </Button>
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <span>CPU: {formatPercent(device.cpuPercent)}</span>
                    <span>Processed: {device.samplesProcessed ?? 'N/A'}</span>
                    <span>
                      Last seen:{' '}
                      {new Date(device.lastSeen).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
