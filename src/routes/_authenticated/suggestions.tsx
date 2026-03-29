import { createFileRoute } from '@tanstack/react-router'
import { SuggestionsPage } from '#/pages/SuggestionsPage'

export const Route = createFileRoute('/_authenticated/suggestions')({
  head: () => ({
    meta: [{ title: 'hum.ai | Suggestions' }],
  }),
  component: SuggestionsPage,
})
