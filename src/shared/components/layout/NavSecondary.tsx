'use client'

import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuBadge,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/shared/components/ui/sidebar'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url !== '#' &&
              (pathname === item.url || pathname.startsWith(`${item.url}/`))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  size="sm"
                  isActive={isActive}
                  render={<Link to={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {isActive ? <SidebarMenuBadge>•</SidebarMenuBadge> : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
