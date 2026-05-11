import { useNavigate } from '@tanstack/react-router'
import { Plus, Settings, PanelLeftIcon } from 'lucide-react'

import { AppSidebar } from '#/shared/components/layout/AppSidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '#/shared/components/ui/breadcrumb'
import { Button } from '#/shared/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '#/shared/components/ui/sidebar'

import { useDashboardData } from '#/features/dashboard/hooks/useDashboardData'
import { DashboardMetricsBar } from '#/features/dashboard/components/DashboardMetricsBar'
import { EdgeMapPanel } from '#/features/dashboard/components/EdgeMapPanel'
import { LiveOpsLog } from '#/features/dashboard/components/LiveOpsLog'
import { RiceGradePanel } from '#/features/dashboard/components/RiceGradePanel'

export function DashboardPage() {
  const navigate = useNavigate()
  const { devices, summary, liveSignalsData, riceGradesData } =
    useDashboardData()

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
            <DashboardMetricsBar summary={summary} />

            <div className="grid grid-cols-1 border-t border-border xl:grid-cols-[2fr_1fr]">
              <EdgeMapPanel
                devices={devices}
                activeDevices={summary.onlineDevices}
              />
              <LiveOpsLog signals={liveSignalsData} />
            </div>

            <div className="border-t border-border">
              <RiceGradePanel grades={riceGradesData} />
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
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
