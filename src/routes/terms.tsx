import { createFileRoute } from '@tanstack/react-router'
import { TermsPage } from '#/pages/TermsPage'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [{ title: 'hum.ai | Terms and Privacy' }],
  }),
  component: TermsPage,
})
