import * as React from 'react'

import { NavMain } from '#/components/nav-main'
import { NavProjects } from '#/components/nav-projects'
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
  Command,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  TerminalSquareIcon,
} from 'lucide-react'

const data = {
  user: {
    name: 'hum.ai Admin',
    email: 'admin@hum.ai',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
        },
        {
          title: 'Analytics',
          url: '#',
        },
        {
          title: 'Alerts',
          url: '#',
        },
      ],
    },
    {
      title: 'Devices',
      url: '#',
      icon: <BotIcon />,
      items: [
        {
          title: 'All Devices',
          url: '#',
        },
        {
          title: 'Groups',
          url: '#',
        },
        {
          title: 'Maintenance',
          url: '#',
        },
      ],
    },
    {
      title: 'Reports',
      url: '#',
      icon: <BookOpenIcon />,
      items: [
        {
          title: 'Daily',
          url: '#',
        },
        {
          title: 'Weekly',
          url: '#',
        },
        {
          title: 'Export',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: <Settings2Icon />,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Access',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: <LifeBuoyIcon />,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: <SendIcon />,
    },
  ],
  projects: [
    {
      name: 'Lab Ops',
      url: '#',
      icon: <FrameIcon />,
    },
    {
      name: 'Rice Quality',
      url: '#',
      icon: <PieChartIcon />,
    },
    {
      name: 'Field Visits',
      url: '#',
      icon: <MapIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">hum.ai</span>
                <span className="truncate text-xs">Rice Analytics</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
