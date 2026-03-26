import { createFileRoute, Navigate } from '@tanstack/react-router'

import { AnalyticsPage } from '#/pages/AnalyticsPage'
import { useAppStore } from '#/store/appStore'

export const Route = createFileRoute('/analytics')({
  head: () => ({
    meta: [{ title: 'hum.ai | Analytics' }],
  }),
  component: AnalyticsRouteComponent,
})

function AnalyticsRouteComponent() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <AnalyticsPage />
}
