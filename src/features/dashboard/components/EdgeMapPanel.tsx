import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { DeviceMap } from '#/components/map/DeviceMap'
import type { Device } from '#/lib/mockData'

type Props = {
  devices: Device[]
  activeDevices: number
}

export function EdgeMapPanel({ devices, activeDevices }: Props) {
  return (
    <div className="border-b border-border xl:border-r xl:border-b-0">
      <div className="flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">PhilRice edge map</h2>
            <Badge className="bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20">
              HEARTBEAT
            </Badge>
          </div>
          <p className="font-mono text-4xl font-semibold text-foreground">
            {activeDevices}
          </p>
          <p className="text-sm text-muted-foreground">
            Devices currently online and reporting telemetry from stations
            nationwide
          </p>
        </div>
        <Button variant="outline" size="sm">
          Manage fleet
        </Button>
      </div>
      <div className="h-124 px-6">
        {devices.length > 0 ? (
          <DeviceMap devices={devices} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            No device connected yet. Add a device to start monitoring your edge
            fleet.
          </div>
        )}
      </div>
    </div>
  )
}
