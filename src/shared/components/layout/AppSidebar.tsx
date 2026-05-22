import * as React from 'react'

import { NavMain } from '#/shared/components/layout/NavMain'
import { NavSecondary } from '#/shared/components/layout/NavSecondary'
import { NavUser } from '#/shared/components/layout/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/shared/components/ui/sidebar'
import {
  BotIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
  FlaskConicalIcon,
  MessageSquareIcon,
  PieChartIcon,
} from 'lucide-react'
import { useCurrentUser } from '#/features/auth/hooks/useCurrentUser'

const navMain = [
  {
    title: 'Results',
    url: '/results',
    icon: <ClipboardCheckIcon />,
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
    title: 'Test Grading',
    url: '/test-grading',
    icon: <FlaskConicalIcon />,
  },
]

const navSecondary = [
  {
    title: 'Suggestions',
    url: '/suggestions',
    icon: <MessageSquareIcon />,
  },
  {
    title: 'Documentation',
    url: '/docs',
    icon: <BookOpenIcon />,
    openInNewTab: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/results" />}>
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
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: '/avatars/shadcn.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
