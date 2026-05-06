import type { ReactNode } from 'react'
import { PanelLeftIcon } from 'lucide-react'

import { AppSidebar } from '#/shared/components/layout/AppSidebar'
import { Button } from '#/shared/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '#/shared/components/ui/sidebar'

type PlatformShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PlatformShell({
  title,
  description,
  actions,
  children,
}: PlatformShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
        <header className="z-40 flex h-16 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
          <DashboardSidebarTrigger />
          <div className="space-y-0.5">
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </header>
        <div>{children}</div>
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
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
      className="group relative"
    >
      <img
        src="/logo-icon.svg"
        alt="hum.ai"
        className="size-6 object-contain transition-opacity group-hover:opacity-20"
      />
      <PanelLeftIcon className="absolute size-4 opacity-0 transition group-hover:opacity-100" />
    </Button>
  )
}
