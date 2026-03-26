import { generateMockSummary, mockDevices } from '#/lib/mockData'
import { ArrowDown, PanelLeftIcon, Plus, Settings } from 'lucide-react'
import { AppSidebar } from '#/components/app-sidebar'
import { DeviceMap } from '#/components/map/DeviceMap'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '#/components/ui/breadcrumb'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '#/components/ui/sidebar'

export function DashboardPage() {
  const summary = generateMockSummary()
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
            <Button className="h-9 bg-logo-color">
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
                  <DeviceMap devices={mockDevices} />
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
                    {liveSignals.map((signal) => (
                      <SignalRow
                        key={`${signal.title}-${signal.timestamp}`}
                        signal={signal}
                      />
                    ))}
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
                  {riceGrades.map((grade) => (
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
                  {moistureWatch.map((item) => (
                    <MoistureRow
                      key={item.site}
                      site={item.site}
                      moisture={item.moisture}
                      delta={item.delta}
                      severity={item.severity}
                    />
                  ))}
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

const liveSignals: LiveSignal[] = [
  {
    level: 'ok',
    title: 'NE-01 heartbeat stable',
    detail: 'CPU 41%, camera online, last ping 2s ago',
    timestamp: 'just now',
  },
  {
    level: 'warn',
    title: 'IS-03 moisture above threshold',
    detail: 'Latest batch reached 14.7% moisture',
    timestamp: '8s ago',
  },
  {
    level: 'info',
    title: 'Start analysis queued',
    detail: 'Operator queued batch PR-2026-0314 on BO-02',
    timestamp: '16s ago',
  },
  {
    level: 'info',
    title: 'Model sync complete',
    detail: 'YOLOv8 weights verified on edge-client v0.4.2',
    timestamp: '24s ago',
  },
  {
    level: 'warn',
    title: 'Camera reconnect event',
    detail: 'DV-05 recovered after USB camera timeout',
    timestamp: '32s ago',
  },
  {
    level: 'info',
    title: 'Upload route switched',
    detail: 'Fallback uploader engaged due to API latency spike',
    timestamp: '40s ago',
  },
]

const riceGrades: RiceGrade[] = [
  {
    name: 'Premium (PNS Grade 1)',
    value: '1,284 samples',
    share: 45,
    status: 'positive',
  },
  {
    name: 'Grade 2',
    value: '917 samples',
    share: 32,
    status: 'positive',
  },
  {
    name: 'Grade 3',
    value: '412 samples',
    share: 14,
    status: 'positive',
  },
  {
    name: 'High Broken / Recheck',
    value: '178 samples',
    share: 6,
    status: 'negative',
  },
  { name: 'Rejected Lots', value: '56 samples', share: 3, status: 'negative' },
]

const moistureWatch: MoistureEntry[] = [
  {
    site: 'PhilRice CES - Drying Bay A',
    moisture: '13.2%',
    delta: '-0.3%',
    severity: 'ok',
  },
  {
    site: 'Isabela Satellite - Intake 2',
    moisture: '14.5%',
    delta: '+0.4%',
    severity: 'warn',
  },
  {
    site: 'Bohol Partner Mill - Lot 7',
    moisture: '13.0%',
    delta: '-0.1%',
    severity: 'ok',
  },
  {
    site: 'Iloilo Drying Complex - Line 2',
    moisture: '15.1%',
    delta: '+0.7%',
    severity: 'warn',
  },
  {
    site: 'Davao Storage Hub - Silo 4',
    moisture: '13.5%',
    delta: '-0.1%',
    severity: 'ok',
  },
]

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
