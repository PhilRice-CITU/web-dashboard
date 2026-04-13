import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Device } from '#/lib/mockData'
import { ArrowDown, PanelLeftIcon, Plus, Settings } from 'lucide-react'
import { AppSidebar } from '#/components/app-sidebar'
import { DeviceMap } from '#/components/map/DeviceMap'
import {
  type ApiAnalyticsSummary,
  type ApiDashboardSummary,
  type ApiDevice,
  type ApiDeviceEvent,
  type ApiDeviceEventsListResponse,
} from '#/api/contracts'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '#/components/ui/breadcrumb'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { useFetch } from '#/hooks/useApi'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '#/components/ui/sidebar'

export function DashboardPage() {
  const navigate = useNavigate()

  const { data: devicesResponse } = useFetch<ApiDevice[]>({
    url: '/devices',
    retry: false,
    refetchInterval: 30_000,
  })

  const { data: analyticsResponse } = useFetch<ApiAnalyticsSummary>({
    url: '/analytics',
    retry: false,
    refetchInterval: 30_000,
  })

  const { data: dashboardResponse } = useFetch<ApiDashboardSummary>({
    url: '/analytics/dashboard',
    retry: false,
    refetchInterval: 30_000,
  })

  const { data: eventsResponse } = useFetch<ApiDeviceEventsListResponse>({
    url: '/device-events?page=1&page_size=6',
    retry: false,
    refetchInterval: 10_000,
  })

  const devices = useMemo<Device[]>(() => {
    if (!devicesResponse || devicesResponse.length === 0) {
      return []
    }

    return devicesResponse.map((device, index) =>
      mapApiDeviceToMapDevice(device, index),
    )
  }, [devicesResponse])

  const summary = useMemo(() => {
    const totalDevices = dashboardResponse?.total_devices ?? devices.length
    const onlineDevices =
      dashboardResponse?.online_devices ??
      devices.filter((device) => device.status !== 'inactive').length

    return {
      totalSamples: dashboardResponse?.scans_processed_today ?? 0,
      onlineDevices,
      totalDevices,
      avgMoistureContent:
        dashboardResponse?.avg_moisture ?? analyticsResponse?.avg_moisture ?? 0,
      avgBrokenGrainPercentage:
        dashboardResponse?.avg_broken_grains ??
        analyticsResponse?.avg_broken_grains ??
        0,
    }
  }, [analyticsResponse, dashboardResponse, devices])

  const liveSignalsData = useMemo(() => {
    if (!eventsResponse?.data || eventsResponse.data.length === 0) {
      return []
    }

    return eventsResponse.data.map(mapApiEventToLiveSignal)
  }, [eventsResponse])

  const riceGradesData = useMemo(() => {
    if (
      dashboardResponse?.grade_distribution &&
      dashboardResponse.grade_distribution.length > 0
    ) {
      return dashboardResponse.grade_distribution.map((grade) => ({
        name: grade.name,
        value: `${grade.value.toLocaleString()} samples`,
        share: Math.round(grade.share),
        status:
          grade.status === 'negative'
            ? ('negative' as const)
            : ('positive' as const),
      }))
    }

    if (analyticsResponse) {
      const total = Math.max(analyticsResponse.total_samples, 1)

      return [
        {
          name: 'Grade A',
          value: `${analyticsResponse.quality_a.toLocaleString()} samples`,
          share: Math.round((analyticsResponse.quality_a / total) * 100),
          status: 'positive' as const,
        },
        {
          name: 'Grade B',
          value: `${analyticsResponse.quality_b.toLocaleString()} samples`,
          share: Math.round((analyticsResponse.quality_b / total) * 100),
          status: 'positive' as const,
        },
        {
          name: 'Grade C',
          value: `${analyticsResponse.quality_c.toLocaleString()} samples`,
          share: Math.round((analyticsResponse.quality_c / total) * 100),
          status: 'negative' as const,
        },
        {
          name: 'Grade D',
          value: `${analyticsResponse.quality_d.toLocaleString()} samples`,
          share: Math.round((analyticsResponse.quality_d / total) * 100),
          status: 'negative' as const,
        },
      ]
    }

    return [
      {
        name: 'Grade A',
        value: '0 samples',
        share: 0,
        status: 'positive' as const,
      },
      {
        name: 'Grade B',
        value: '0 samples',
        share: 0,
        status: 'positive' as const,
      },
      {
        name: 'Grade C',
        value: '0 samples',
        share: 0,
        status: 'negative' as const,
      },
      {
        name: 'Grade D',
        value: '0 samples',
        share: 0,
        status: 'negative' as const,
      },
    ]
  }, [analyticsResponse, dashboardResponse])

  const moistureWatchData = useMemo(() => {
    if (
      dashboardResponse?.moisture_watch &&
      dashboardResponse.moisture_watch.length > 0
    ) {
      return dashboardResponse.moisture_watch.map((item) => ({
        site: item.device_name,
        moisture: `${item.moisture.toFixed(1)}%`,
        delta: `${item.delta >= 0 ? '+' : ''}${item.delta.toFixed(1)}%`,
        severity:
          item.severity === 'warn' ? ('warn' as const) : ('ok' as const),
      }))
    }

    return []
  }, [dashboardResponse])

  const activeDevices = summary.onlineDevices

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
        <header className="z-40 flex h-16 items-center gap-3 bg-background px-6 md:px-6">
          <DashboardSidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="h-9">
              <Settings className="mr-2 size-4" />
              Settings
            </Button>
            <Button
              className="h-9 bg-logo-color"
              onClick={() => navigate({ to: '/devices' })}
            >
              <Plus className="mr-2 size-4" />
              Add Device
            </Button>
          </div>
        </header>

        <div className="space-y-0">
          <section className="overflow-hidden border-y border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              <SignalMetric
                label="Online edge devices"
                value={`${activeDevices}/${summary.totalDevices}`}
                footer={`${summary.totalDevices - activeDevices} offline`}
                status="negative"
              />
              <SignalMetric
                label="Scans processed today"
                value={summary.totalSamples.toLocaleString()}
                footer="Across all stations"
                status="positive"
              />
              <SignalMetric
                label="Average moisture"
                value={`${summary.avgMoistureContent.toFixed(1)}%`}
                footer="PNS target <= 14.0%"
                status="negative"
              />
              <SignalMetric
                label="Avg broken grains"
                value={`${summary.avgBrokenGrainPercentage.toFixed(1)}%`}
                footer="Lower is better"
                status="positive"
              />
            </div>

            <div className="grid grid-cols-1 border-t border-border xl:grid-cols-[2fr_1fr]">
              <div className="border-b border-border xl:border-r xl:border-b-0">
                <div className="flex items-start justify-between gap-3 p-4 md:p-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold">
                        PhilRice edge map
                      </h2>
                      <Badge className="bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20">
                        HEARTBEAT
                      </Badge>
                    </div>
                    <p className="font-mono text-4xl font-semibold text-foreground">
                      {activeDevices}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Devices currently online and reporting telemetry from
                      stations nationwide
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
                      No device connected yet. Add a device to start monitoring
                      your edge fleet.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-5">
                  <h2 className="text-base font-semibold">
                    Live operations log
                  </h2>
                  <p className="text-sm text-muted-foreground">Real-time</p>
                </div>
                <div className="hide-scrollbar h-full overflow-y-auto">
                  <div className="space-y-1 py-2">
                    {liveSignalsData.length > 0 ? (
                      liveSignalsData.map((signal) => (
                        <SignalRow
                          key={`${signal.title}-${signal.timestamp}`}
                          signal={signal}
                        />
                      ))
                    ) : (
                      <p className="px-5 py-6 text-sm text-muted-foreground">
                        No live events yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 border-t border-border xl:grid-cols-2">
              <div className="border-b border-border p-4 md:p-5 xl:border-r xl:border-b-0">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">
                    Rice grade distribution
                  </h2>
                  <p className="text-sm text-muted-foreground">Top lots</p>
                </div>
                <div className="space-y-3">
                  {riceGradesData.map((grade) => (
                    <RiceRow
                      key={grade.name}
                      name={grade.name}
                      value={grade.value}
                      share={grade.share}
                      status={grade.status}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">
                    Moisture risk watch
                  </h2>
                  <p className="text-sm text-muted-foreground">SLO 14.0%</p>
                </div>
                <div className="space-y-3">
                  {moistureWatchData.length > 0 ? (
                    moistureWatchData.map((item) => (
                      <MoistureRow
                        key={item.site}
                        site={item.site}
                        moisture={item.moisture}
                        delta={item.delta}
                        severity={item.severity}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No moisture trend data available yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

type SignalMetricProps = {
  label: string
  value: string
  footer: string
  status: 'positive' | 'negative'
}

function SignalMetric({ label, value, footer, status }: SignalMetricProps) {
  return (
    <div className="space-y-2 border-b border-border p-5 md:border-r md:nth-2:border-r-0 xl:border-b-0 xl:nth-2:border-r xl:nth-2:border-border xl:nth-4:border-r-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p
        className={`flex items-center gap-1 text-sm ${
          status === 'positive' ? 'text-emerald-700' : 'text-rose-600'
        }`}
      >
        <ArrowDown
          className={status === 'positive' ? 'size-4 rotate-180' : 'size-4'}
        />
        {footer}
      </p>
    </div>
  )
}

type SignalLevel = 'ok' | 'warn' | 'info'

type LiveSignal = {
  level: SignalLevel
  title: string
  detail: string
  timestamp: string
}

type RiceGrade = {
  name: string
  value: string
  share: number
  status: 'positive' | 'negative'
}

type MoistureEntry = {
  site: string
  moisture: string
  delta: string
  severity: 'ok' | 'warn'
}

type SignalRowProps = {
  signal: LiveSignal
}

function SignalRow({ signal }: SignalRowProps) {
  return (
    <div className="space-y-0 border-b border-border py-3 last:border-b-0 px-5">
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className={getSignalBadgeClass(signal.level)}>
          {signal.level.toUpperCase()}
        </div>
        <p className="text-xs text-muted-foreground">{signal.timestamp}</p>
      </div>
      <p className="text-lg font-semibold tracking-tight text-foreground">
        {signal.title}
      </p>
      <p className="text-sm text-muted-foreground">{signal.detail}</p>
    </div>
  )
}

type RiceRowProps = RiceGrade

function RiceRow({ name, value, share, status }: RiceRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-medium text-foreground">{name}</p>
        <div className="flex items-center gap-3">
          <p className="font-mono text-base font-semibold text-foreground">
            {value}
          </p>
          <p className="w-14 text-right text-sm text-muted-foreground">
            {share}%
          </p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-muted">
        <div
          className={`h-full ${
            status === 'positive' ? 'bg-emerald-600/70' : 'bg-amber-500/70'
          }`}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  )
}

type MoistureRowProps = MoistureEntry

function MoistureRow({ site, moisture, delta, severity }: MoistureRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-medium text-foreground">{site}</p>
        <div className="flex items-center gap-3">
          <p className="font-mono text-base font-semibold text-foreground">
            {moisture}
          </p>
          <p
            className={`w-14 text-right text-sm ${
              severity === 'warn' ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {delta}
          </p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-muted">
        <div
          className={
            severity === 'warn'
              ? 'h-full bg-rose-500/70'
              : 'h-full bg-emerald-600/70'
          }
          style={{
            width: `${Math.min(Math.round(Number.parseFloat(moisture) * 6), 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

function getSignalBadgeClass(level: SignalLevel) {
  if (level === 'ok') {
    return 'border text-xs border-emerald-300 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 px-1'
  }

  if (level === 'warn') {
    return 'border text-xs border-amber-300 bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 px-1'
  }

  return 'border text-xs border-sky-300 bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 px-1'
}

function mapApiDeviceToMapDevice(device: ApiDevice, index: number): Device {
  const status =
    device.status === 'offline'
      ? 'inactive'
      : device.status === 'maintenance'
        ? 'scanning'
        : 'active'

  return {
    id: device.id,
    name: device.display_name,
    group: 'Live Fleet',
    status,
    lastSeen: device.updated_at,
    samplesProcessed: 45 + (seededNumber(device.id, 0, 360) % 360),
    cpu: device.cpu_percent ?? 0,
    latitude: seededCoordinate(device.id, 14.8, 16.1, index),
    longitude: seededCoordinate(device.id, 120.4, 121.6, index + 2),
    location: `Region ${device.region_id.slice(0, 8)}`,
  }
}

function mapApiEventToLiveSignal(event: ApiDeviceEvent): LiveSignal {
  const level: SignalLevel =
    event.level === 'ERROR' ? 'warn' : event.level === 'WARN' ? 'warn' : 'info'

  return {
    level,
    title: event.device_id ? `${event.device_id} event` : 'System event',
    detail: event.message,
    timestamp: new Date(event.created_at).toLocaleTimeString(),
  }
}

function seededNumber(seed: string, min: number, max: number): number {
  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return min + (hash % Math.max(max - min, 1))
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

function DashboardSidebarTrigger() {
  const { state, toggleSidebar } = useSidebar()

  if (state !== 'collapsed') {
    return <SidebarTrigger />
  }

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
      className="group relative flex size-8 items-center justify-center rounded-md transition hover:bg-muted"
    >
      <img
        src="/logo-icon.svg"
        alt="hum.ai"
        className="size-6 object-contain transition-opacity group-hover:opacity-20"
      />
      <PanelLeftIcon className="absolute size-4 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}
