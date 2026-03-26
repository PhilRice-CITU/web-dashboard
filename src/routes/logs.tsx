import { createFileRoute, Navigate } from '@tanstack/react-router'

import { LogsPage } from '#/pages/LogsPage'
import { useAppStore } from '#/store/appStore'

export const Route = createFileRoute('/logs')({
  head: () => ({
    meta: [{ title: 'hum.ai | Logs' }],
  }),
  component: LogsRouteComponent,
})

function LogsRouteComponent() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <LogsPage />
}
