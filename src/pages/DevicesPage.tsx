import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { httpClient } from '#/api/client'
import type { ApiDevice, ApiDeviceCommand } from '#/api/contracts'
import { useFetch } from '#/hooks/useApi'

type DeviceAction =
  | 'capture'
  | 'restart-app'
  | 'restart-device'
  | 'shutdown-device'
  | 'view-device'

type FleetDevice = {
  id: string
  name: string
  group?: string
  status: 'inactive' | 'scanning' | 'active'
  lastSeen: string
  samplesProcessed: number
  cpuPercent: number | null
  memoryPercent: number | null
  storagePercent: number | null
  temperatureCelsius: number | null
  queueDepth: number | null
  latitude: number
  longitude: number
  location: string
}

export function DevicesPage() {
  const queryClient = useQueryClient()
  const [addDeviceOpen, setAddDeviceOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [newDeviceCode, setNewDeviceCode] = useState('')
  const [newDeviceName, setNewDeviceName] = useState('')
  const [newDeviceLocation, setNewDeviceLocation] = useState('')
  const [queuedCommandName, setQueuedCommandName] = useState('restart-app')
  const [actionState, setActionState] = useState<Record<string, string>>({})
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)

  const {
    data: deviceRows,
    isLoading: isDevicesLoading,
    error: devicesError,
  } = useFetch<ApiDevice[]>({
    url: '/devices',
    retry: false,
    refetchInterval: 30_000,
  })

  const devices = useMemo<FleetDevice[]>(() => {
    return (deviceRows ?? []).map((device, index) =>
      mapApiDeviceToFleetDevice(device, index),
    )
  }, [deviceRows])

  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(devices[0].id)
      return
    }

    if (
      selectedDeviceId &&
      devices.length > 0 &&
      !devices.some((device) => device.id === selectedDeviceId)
    ) {
      setSelectedDeviceId(devices[0].id)
    }
  }, [devices, selectedDeviceId])

  const selectedDevice = devices.find(
    (device) => device.id === selectedDeviceId,
  )

  const { data: commandHistory = [] } = useFetch<ApiDeviceCommand[]>({
    url: selectedDevice
      ? `/devices/${selectedDevice.id}/commands?limit=20`
      : '/devices/placeholder/commands?limit=20',
    enabled: Boolean(selectedDevice),
    retry: false,
    refetchInterval: 10_000,
  })

  const createDeviceMutation = useMutation({
    mutationFn: async (payload: {
      display_name: string
      device_id?: string
    }) => {
      const response = await httpClient.post<ApiDevice>('/devices', payload)
      return response.data
    },
    onSuccess: (createdDevice) => {
      queryClient.invalidateQueries({ queryKey: ['/devices'] })
      setAddDeviceOpen(false)
      setActionState((current) => ({
        ...current,
        [createdDevice.id]: `Device registered • ${new Date().toLocaleTimeString()}`,
      }))
      setNewDeviceCode('')
      setNewDeviceName('')
      setNewDeviceLocation('')
    },
  })

  const commandMutation = useMutation({
    mutationFn: async (payload: { deviceId: string; command: string }) => {
      const response = await httpClient.post<ApiDeviceCommand>(
        `/devices/${payload.deviceId}/command`,
        {
          command: payload.command,
          args: {
            source: 'web-dashboard',
          },
        },
      )
      return response.data
    },
  })

  const telemetry = useMemo(
    () => getDeviceTelemetry(selectedDevice),
    [selectedDevice],
  )

  const latestCommand = commandHistory.at(0)

  const queueCommand = (deviceId: string, command: string) => {
    commandMutation.mutate(
      { deviceId, command },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [`/devices/${deviceId}/commands?limit=20`],
          })
          setActionState((current) => ({
            ...current,
            [deviceId]: `Command queued (${command}) • ${new Date().toLocaleTimeString()}`,
          }))
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? 'Failed to queue command'
          setActionState((current) => ({
            ...current,
            [deviceId]: `${message} • ${new Date().toLocaleTimeString()}`,
          }))
        },
      },
    )
  }

  const runDeviceAction = (action: DeviceAction) => {
    if (!selectedDevice) {
      return
    }

    const actionLabel: Record<DeviceAction, string> = {
      capture: 'Photo capture requested',
      'restart-app': 'Application restart command sent',
      'restart-device': 'Device restart scheduled',
      'shutdown-device': 'Shutdown command queued',
      'view-device': 'Viewing device telemetry and controls',
    }

    if (action !== 'view-device') {
      queueCommand(selectedDevice.id, action)
      return
    }

    setActionState((current) => ({
      ...current,
      [selectedDevice.id]: `${actionLabel[action]} • ${new Date().toLocaleTimeString()}`,
    }))
  }

  const handleSaveDevice = () => {
    const displayName =
      newDeviceName.trim() ||
      newDeviceCode.trim() ||
      `Edge Device ${Date.now()}`
    const deviceId = newDeviceCode.trim()

    createDeviceMutation.mutate({
      display_name: displayName,
      ...(deviceId ? { device_id: deviceId } : {}),
    })
  }

  const handleQueueModalCommand = () => {
    if (!selectedDevice) {
      return
    }

    queueCommand(selectedDevice.id, normalizeCommand(queuedCommandName))
    setCommandOpen(false)
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
                    value={selectedDevice?.id ?? ''}
                    readOnly
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="command-name">Command</Label>
                  <Input
                    id="command-name"
                    placeholder="restart_capture_service"
                    value={queuedCommandName}
                    onChange={(event) =>
                      setQueuedCommandName(event.target.value)
                    }
                  />
                </div>
              </div>
              <SheetFooter>
                <Button
                  onClick={handleQueueModalCommand}
                  disabled={!selectedDevice || commandMutation.isPending}
                >
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
                  <Input
                    id="device-id"
                    placeholder="UUID "
                    value={newDeviceCode}
                    onChange={(event) => setNewDeviceCode(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-name">Display name</Label>
                  <Input
                    id="device-name"
                    placeholder="Nueva Ecija - Lab 4"
                    value={newDeviceName}
                    onChange={(event) => setNewDeviceName(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="device-location">Location</Label>
                  <Input
                    id="device-location"
                    placeholder="PhilRice CES"
                    value={newDeviceLocation}
                    onChange={(event) =>
                      setNewDeviceLocation(event.target.value)
                    }
                  />
                </div>
              </div>
              <SheetFooter>
                <Button
                  onClick={handleSaveDevice}
                  disabled={createDeviceMutation.isPending}
                >
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
          <MetricCard label="Total Devices" value={String(devices.length)} />
          <MetricCard
            label="Online"
            value={String(
              devices.filter((item) => item.status !== 'inactive').length,
            )}
          />
          <MetricCard
            label="In Maintenance"
            value={String(
              devices.filter((item) => item.status === 'scanning').length,
            )}
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
              {!isDevicesLoading && devicesError ? (
                <div className="px-4 py-3 text-sm text-rose-700">
                  Failed to load devices from API.
                </div>
              ) : null}

              {!isDevicesLoading && !devicesError && devices.length === 0 ? (
                <div className="px-4 py-4 text-sm text-muted-foreground">
                  No device connected yet. Add a device to start receiving
                  telemetry and commands.
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
                      selectedDevice?.id === device.id
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
                          <span>{formatPercent(device.cpuPercent)}</span>
                          <span>
                            {formatTemperature(rowTelemetry.temperatureCelsius)}
                          </span>
                          <span>
                            {formatPercent(rowTelemetry.memoryPercent)}
                          </span>
                          <span>
                            {formatPercent(rowTelemetry.storagePercent)}
                          </span>
                          <span>{formatInteger(rowTelemetry.queueDepth)}</span>
                          <span>{rowTelemetry.cameraStatus}</span>
                          <span>
                            {formatLatency(rowTelemetry.networkLatencyMs)}
                          </span>
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
                          <span>CPU: {formatPercent(device.cpuPercent)}</span>
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
                      onClick={() => setIsRightPanelCollapsed(true)}
                    >
                      <ChevronsRight className="mr-1 size-3.5" />
                      Collapse
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 px-4">
                  <TelemetryTile
                    label="CPU"
                    value={formatPercent(telemetry.cpuPercent)}
                  />
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
                          LIVE • {selectedDevice?.id ?? 'N/A'} •{' '}
                          {formatLatency(telemetry.networkLatencyMs)}
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
                        {actionState[selectedDevice?.id ?? ''] ??
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
                        {selectedDevice
                          ? new Date(selectedDevice.lastSeen).toLocaleString()
                          : 'N/A'}
                      </p>
                      <p>
                        Approx network latency:{' '}
                        {formatLatency(telemetry.networkLatencyMs)}
                      </p>
                      <p>
                        Total samples processed:{' '}
                        {selectedDevice?.samplesProcessed ?? 0}
                      </p>
                      {latestCommand ? (
                        <p>
                          Latest command: {latestCommand.command} (
                          {latestCommand.status})
                        </p>
                      ) : null}
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

function getDeviceTelemetry(device: FleetDevice | undefined) {
  if (!device) {
    return {
      cpuPercent: null,
      memoryPercent: null,
      storagePercent: null,
      temperatureCelsius: null,
      queueDepth: null,
      cameraStatus: 'offline',
      networkLatencyMs: null,
    }
  }
  const cameraStatus = device.status === 'inactive' ? 'offline' : 'online'

  return {
    cpuPercent: device.cpuPercent,
    memoryPercent: device.memoryPercent,
    storagePercent: device.storagePercent,
    temperatureCelsius: device.temperatureCelsius,
    queueDepth: device.queueDepth,
    cameraStatus,
    networkLatencyMs: null,
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

function normalizeCommand(value: string): string {
  const command = value.trim().toLowerCase()
  if (
    command === 'capture' ||
    command === 'restart-app' ||
    command === 'restart-device' ||
    command === 'shutdown-device'
  ) {
    return command
  }

  return 'restart-app'
}

function mapApiDeviceToFleetDevice(
  device: ApiDevice,
  index: number,
): FleetDevice {
  return {
    id: device.id,
    name: device.display_name,
    group: 'Live Fleet',
    status:
      device.status === 'offline'
        ? 'inactive'
        : device.status === 'maintenance'
          ? 'scanning'
          : 'active',
    lastSeen: device.updated_at,
    samplesProcessed: 30 + seededNumber(device.id, 0, 540),
    cpuPercent: device.cpu_percent,
    memoryPercent: device.memory_percent,
    storagePercent: device.storage_percent,
    temperatureCelsius: device.temperature_celsius,
    queueDepth: device.queue_depth,
    latitude: seededCoordinate(device.id, 14.8, 16.1, index),
    longitude: seededCoordinate(device.id, 120.4, 121.6, index + 4),
    location: `Region ${device.region_id.slice(0, 8)}`,
  }
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return 'N/A'
  }
  return `${value.toFixed(1)}%`
}

function formatTemperature(value: number | null): string {
  if (value === null) {
    return 'N/A'
  }
  return `${value.toFixed(1)} C`
}

function formatInteger(value: number | null): string {
  if (value === null) {
    return 'N/A'
  }
  return String(value)
}

function formatLatency(value: number | null): string {
  if (value === null) {
    return 'N/A'
  }
  return `${value}ms`
}

function seededNumber(seed: string, min: number, max: number): number {
  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return min + (hash % Math.max(max - min + 1, 1))
}

function seededCoordinate(
  seed: string,
  min: number,
  max: number,
  offset = 0,
): number {
  const value = seededNumber(`${seed}-${offset}`, 0, 10_000)
  const normalized = value / 10_000
  return Number((min + (max - min) * normalized).toFixed(6))
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
