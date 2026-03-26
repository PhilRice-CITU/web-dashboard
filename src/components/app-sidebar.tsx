import * as React from 'react'

import { NavMain } from '#/components/nav-main'
import { NavSecondary } from '#/components/nav-secondary'
import { NavUser } from '#/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar'
import {
  BotIcon,
  BookOpenIcon,
  CommandIcon,
  FileClockIcon,
  PieChartIcon,
} from 'lucide-react'

const data = {
  user: {
    name: 'Henry Corpus',
    email: 'admin@hum.ai',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Operations',
      url: '/dashboard',
      icon: <CommandIcon />,
    },
    {
      title: 'Devices',
      url: '/devices',
      icon: <BotIcon />,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: <PieChartIcon />,
    },
    {
      title: 'Logs',
      url: '/logs',
      icon: <FileClockIcon />,
    },
  ],
  navSecondary: [
    {
      title: 'Documentation',
      url: '/docs',
      icon: <BookOpenIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <img
                  src="/logo-icon.svg"
                  alt="hum.ai"
                  className="size-7 rounded-sm object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">hum.ai</span>
                <span className="truncate text-xs">Rice Analytics</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-1">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
