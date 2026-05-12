import { createFileRoute } from '@tanstack/react-router'

import { ResultsInboxPage } from '#/pages/ResultsInboxPage'

export const Route = createFileRoute('/_authenticated/results')({
  head: () => ({
    meta: [{ title: 'hum.ai | Results' }],
  }),
  component: ResultsInboxPage,
})
