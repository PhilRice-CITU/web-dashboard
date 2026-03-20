import { createFileRoute, Navigate } from '@tanstack/react-router'
import { DashboardPage } from '#/pages/DashboardPage'
import { useAppStore } from '#/store/appStore'

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [{ title: 'hum.ai | Dashboard' }],
  }),
  component: DashboardRouteComponent,
})

function DashboardRouteComponent() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <DashboardPage />
}
