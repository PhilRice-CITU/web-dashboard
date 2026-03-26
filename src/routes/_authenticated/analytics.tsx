import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '#/pages/AnalyticsPage'

export const Route = createFileRoute('/_authenticated/analytics')({
  head: () => ({
    meta: [{ title: 'hum.ai | Analytics' }],
  }),
  component: AnalyticsPage,
})
