import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/pages/DashboardPage'

export const Route = createFileRoute('/_authenticated/dashboard')({
  head: () => ({
    meta: [{ title: 'hum.ai | Platform' }],
  }),
  component: DashboardPage,
})
