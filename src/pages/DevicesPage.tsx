import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Camera,
  ChevronsRight,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  Send,
  Thermometer,
} from 'lucide-react'

import { PlatformShell } from '#/components/layout/PlatformShell'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { mockDevices } from '#/lib/mockData'

type DeviceAction =
  | 'capture'
  | 'restart-app'
  | 'restart-device'
  | 'shutdown-device'
  | 'view-device'

export function DevicesPage() {
  const [addDeviceOpen, setAddDeviceOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    mockDevices[0]?.id ?? '',
  )
  const [actionState, setActionState] = useState<Record<string, string>>({})
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)

  const selectedDevice =
    mockDevices.find((device) => device.id === selectedDeviceId) ??
    mockDevices[0]

  const telemetry = useMemo(
    () => getDeviceTelemetry(selectedDevice),
    [selectedDevice],
  )

  const runDeviceAction = (action: DeviceAction) => {
    const actionLabel: Record<DeviceAction, string> = {
      capture: 'Photo capture requested',
      'restart-app': 'Application restart command sent',
      'restart-device': 'Device restart scheduled',
      'shutdown-device': 'Shutdown command queued',
      'view-device': 'Viewing device telemetry and controls',
    }

    setActionState((current) => ({
      ...current,
      [selectedDevice.id]: `${actionLabel[action]} • ${new Date().toLocaleTimeString()}`,
    }))
  }

  return (
    <PlatformShell
      title="Device Fleet"
      description="Manage edge devices, trigger actions, and monitor station readiness."
      actions={
        <>
          <Sheet open={commandOpen} onOpenChange={setCommandOpen}>
            <SheetTrigger
              render={<Button variant="outline" size="sm" className="h-9" />}
            >
              <Send className="mr-2 size-4" />
              Send Command
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Remote Command</SheetTitle>
                <SheetDescription>
                  Queue a command for one or more online devices.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-1.5">
                  <Label htmlFor="device-target">Target device</Label>
                  <Input
                    id="device-target"
                    placeholder="NE-01 or Group: Isabela"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="command-name">Command</Label>
                  <Input
                    id="command-name"
                    placeholder="restart_capture_service"
                  />
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => setCommandOpen(false)}>
                  Queue Command
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
            <SheetTrigger
              render={<Button size="sm" />}
              className="h-9 bg-logo-color"
            >
              <Plus className="mr-2 size-4" />
              Add Device
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Device</SheetTitle>
                <SheetDescription>
                  Register a new Pi edge device for this deployment.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-1.5">
                  <Label htmlFor="device-id">Device ID</Label>
                  <Input id="device-id" placeholder="NE-04" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-name">Display name</Label>
                  <Input id="device-name" placeholder="Nueva Ecija - Lab 4" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-location">Location</Label>
                  <Input id="device-location" placeholder="PhilRice CES" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-ip">IP / Host</Label>
                  <Input id="device-ip" placeholder="100.102.22.4" />
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => setAddDeviceOpen(false)}>
                  Save Device
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      }
    >
      <section className="overflow-hidden border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <MetricCard
            label="Total Devices"
            value={String(mockDevices.length)}
          />
          <MetricCard
            label="Online"
            value={String(
              mockDevices.filter((item) => item.status !== 'inactive').length,
            )}
          />
          <MetricCard
            label="In Maintenance"
            value={String(mockDevices.filter((item) => item.cpu > 80).length)}
          />
        </div>

        <div
          className={`grid grid-cols-1 border-t border-border ${
            isRightPanelCollapsed
              ? 'xl:grid-cols-1'
              : 'xl:grid-cols-[1.2fr_1.8fr]'
          }`}
        >
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

              {mockDevices.map((device) => {
                const rowTelemetry = getDeviceTelemetry(device)

                return (
                  <div
                    key={device.id}
                    onClick={() => {
                      setSelectedDeviceId(device.id)

                      if (isRightPanelCollapsed) {
                        setIsRightPanelCollapsed(false)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedDeviceId(device.id)

                        if (isRightPanelCollapsed) {
                          setIsRightPanelCollapsed(false)
                        }
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`w-full px-4 py-3 text-left transition hover:bg-muted/50 md:px-5 ${
                      selectedDevice.id === device.id
                        ? 'bg-muted/70'
                        : 'bg-background'
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
                      {isRightPanelCollapsed ? null : (
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
                            <Badge
                              className={getStatusBadgeClass(device.status)}
                            >
                              {device.status}
                            </Badge>
                          </span>
                          <span>{device.cpu}%</span>
                          <span>{rowTelemetry.temperature.toFixed(1)}C</span>
                          <span>{rowTelemetry.memory}%</span>
                          <span>{rowTelemetry.storage}%</span>
                          <span>{rowTelemetry.queueDepth}</span>
                          <span>{rowTelemetry.cameraStatus}</span>
                          <span>{rowTelemetry.networkLatencyMs}ms</span>
                          <span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={(event) => {
                                event.stopPropagation()
                                setSelectedDeviceId(device.id)
                                setIsRightPanelCollapsed(false)
                                setActionState((current) => ({
                                  ...current,
                                  [device.id]: `Viewing device telemetry and controls • ${new Date().toLocaleTimeString()}`,
                                }))
                              }}
                            >
                              View
                            </Button>
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-4">
                          <span>CPU: {device.cpu}%</span>
                          <span>Processed: {device.samplesProcessed}</span>
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

          {isRightPanelCollapsed ? null : (
            <div className="bg-background">
              <div className="space-y-4 p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
                  <div>
                    <h3 className="text-base font-semibold">
                      {selectedDevice.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDevice.id} •{' '}
                      {selectedDevice.group ?? 'Ungrouped'} •{' '}
                      {selectedDevice.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getStatusBadgeClass(selectedDevice.status)}
                    >
                      {selectedDevice.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRightPanelCollapsed(true)}
                    >
                      <ChevronsRight className="mr-1 size-3.5" />
                      Collapse
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 px-4">
                  <TelemetryTile label="CPU" value={`${selectedDevice.cpu}%`} />
                  <TelemetryTile
                    label="Memory"
                    value={`${telemetry.memory}%`}
                  />
                  <TelemetryTile
                    label="Storage"
                    value={`${telemetry.storage}%`}
                  />
                  <TelemetryTile
                    label="Temperature"
                    value={`${telemetry.temperature.toFixed(1)} C`}
                    icon={<Thermometer className="size-3.5" />}
                  />
                  <TelemetryTile
                    label="Queue Depth"
                    value={String(telemetry.queueDepth)}
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

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 border-t border-border px-4">
                  <div className="col-span-2 border-none border-r border-border py-4">
                    <CardHeader className="pb-2 px-0">
                      <CardTitle className="text-sm">
                        Live Camera Feed
                      </CardTitle>
                      <CardDescription>
                        Mock preview stream for now. Wire to real camera
                        endpoint later.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="relative h-64 overflow-hidden rounded-md border border-border bg-[radial-gradient(circle_at_top,#1f2937,#020617_65%)]">
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] animate-pulse" />
                        <div className="absolute bottom-2 left-2 rounded bg-black/65 px-2 py-1 text-xs text-slate-100">
                          LIVE • {selectedDevice.id} •{' '}
                          {telemetry.networkLatencyMs}ms
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => runDeviceAction('capture')}
                        >
                          <Camera className="mr-2 size-4" />
                          Capture Photo
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => runDeviceAction('restart-app')}
                        >
                          <RefreshCw className="mr-2 size-4" />
                          Restart App
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => runDeviceAction('restart-device')}
                        >
                          <RotateCcw className="mr-2 size-4" />
                          Restart Device
                        </Button>
                        <Button
                          variant="outline"
                          className="text-rose-700"
                          onClick={() => runDeviceAction('shutdown-device')}
                        >
                          <Power className="mr-2 size-4" />
                          Turn Off Device
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {actionState[selectedDevice.id] ??
                          'No control action sent yet.'}
                      </p>
                    </CardContent>
                  </div>

                  <div className="border-l border-border">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-sm">
                        Monitoring Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        Last heartbeat:{' '}
                        {new Date(selectedDevice.lastSeen).toLocaleString()}
                      </p>
                      <p>
                        Approx network latency: {telemetry.networkLatencyMs}ms
                      </p>
                      <p>
                        Total samples processed:{' '}
                        {selectedDevice.samplesProcessed}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PlatformShell>
  )
}

function getDeviceTelemetry(device: (typeof mockDevices)[number]) {
  const memory = Math.min(91, Math.max(24, device.cpu + 9))
  const storage = Math.min(
    89,
    Math.max(32, 42 + (device.samplesProcessed % 33)),
  )
  const temperature = Math.min(79, Math.max(34, 35 + device.cpu * 0.55))
  const queueDepth =
    device.status === 'inactive' ? 0 : 1 + (device.samplesProcessed % 7)
  const cameraStatus = device.status === 'inactive' ? 'offline' : 'online'

  return {
    memory,
    storage,
    temperature,
    queueDepth,
    cameraStatus,
    networkLatencyMs:
      device.status === 'inactive' ? 0 : 42 + (device.samplesProcessed % 34),
  }
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-none border-0 border-b border-border ring-0 md:border-r md:last:border-r-0 md:border-b-0">
      <CardHeader className="p-5">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mono text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}

function getStatusBadgeClass(status: 'inactive' | 'scanning' | 'active') {
  if (status === 'active') {
    return 'bg-emerald-500/15 text-emerald-700'
  }

  if (status === 'scanning') {
    return 'bg-amber-500/15 text-amber-700'
  }

  return 'bg-slate-500/15 text-slate-700'
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
