import { useAppStore } from '#/store/appStore'
import { mockDevices, generateMockSummary, mockHistory } from '#/lib/mockData'
import { Activity, Cpu, Plus, Settings, Wheat, Wifi } from 'lucide-react'
import { AppSidebar } from '#/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '#/components/ui/breadcrumb'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar'

export function DashboardPage() {
  const user = useAppStore((state) => state.user)
  const summary = generateMockSummary()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 size-4" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Add Device
            </Button>
          </div>
        </header>

        <div className="space-y-6 p-4 md:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              hum.ai Operations
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name ?? 'Operator'}
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Samples"
              value={summary.totalSamples.toLocaleString()}
              icon={<Wheat className="size-4" />}
            />
            <MetricCard
              title="Quality A"
              value={`${summary.qualityAPercentage}%`}
              icon={<Activity className="size-4" />}
            />
            <MetricCard
              title="Online Devices"
              value={`${summary.onlineDevices}/${summary.totalDevices}`}
              icon={<Wifi className="size-4" />}
            />
            <MetricCard
              title="Avg Moisture"
              value={`${summary.avgMoistureContent.toFixed(1)}%`}
              icon={<Cpu className="size-4" />}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {device.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {device.group || 'No group'} · Last seen{' '}
                        {new Date(device.lastSeen).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        device.status === 'online' ? 'default' : 'secondary'
                      }
                    >
                      {device.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockHistory.map((result) => (
                    <div
                      key={result.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-border px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {result.deviceName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.totalGrains} grains ·{' '}
                          {result.moistureContent.toFixed(1)}% moisture
                        </p>
                      </div>
                      <Badge variant="outline">
                        Grade {result.qualityGrade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="rounded-md border border-border bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
