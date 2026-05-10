import { createFileRoute } from '@tanstack/react-router'

import { ScanDetailPage } from '#/pages/ScanDetailPage'

export const Route = createFileRoute('/_authenticated/scans/$scanId')({
  head: () => ({
    meta: [{ title: 'hum.ai | Scan' }],
  }),
  component: ScanDetailPage,
})
