import { createFileRoute, Navigate } from '@tanstack/react-router'

import { DocumentationPage } from '#/pages/DocumentationPage'
import { useAppStore } from '#/store/appStore'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [{ title: 'hum.ai | Documentation' }],
  }),
  component: DocumentationRouteComponent,
})

function DocumentationRouteComponent() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <DocumentationPage />
}
