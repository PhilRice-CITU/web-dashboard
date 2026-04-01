import { createFileRoute } from '@tanstack/react-router'
import { ImageExplorerPage } from '#/pages/ImageExplorerPage'

export const Route = createFileRoute('/_authenticated/images')({
  head: () => ({
    meta: [{ title: 'hum.ai | Captured Images' }],
  }),
  component: ImageExplorerPage,
})
