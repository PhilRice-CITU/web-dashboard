import { createFileRoute } from '@tanstack/react-router'
import { DocsLayout } from '#/features/docs/components/DocsLayout'

export const Route = createFileRoute('/docs')({
  component: DocsLayout,
})
