import { createFileRoute, Outlet } from '@tanstack/react-router'

// Skeleton layout route — replaced with the real DocsLayout in Task 17.
export const Route = createFileRoute('/docs')({
  component: () => <Outlet />,
})
