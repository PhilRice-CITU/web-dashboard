import { createFileRoute } from '@tanstack/react-router'
import { DocumentationPage } from '#/pages/DocumentationPage'

export const Route = createFileRoute('/_authenticated/docs')({
  head: () => ({
    meta: [{ title: 'hum.ai | Documentation' }],
  }),
  component: DocumentationPage,
})
