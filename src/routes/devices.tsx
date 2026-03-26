import { createFileRoute, Navigate } from '@tanstack/react-router'

import { DevicesPage } from '#/pages/DevicesPage'
import { useAppStore } from '#/store/appStore'

export const Route = createFileRoute('/devices')({
  head: () => ({
    meta: [{ title: 'hum.ai | Devices' }],
  }),
  component: DevicesRouteComponent,
})

function DevicesRouteComponent() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <DevicesPage />
}
