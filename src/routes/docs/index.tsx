import { createFileRoute, redirect } from '@tanstack/react-router'
import { FIRST_DOC_SLUG } from '#/features/docs/docs.config'

export const Route = createFileRoute('/docs/')({
  beforeLoad: () => {
    throw redirect({
      to: '/docs/$',
      params: { _splat: FIRST_DOC_SLUG },
    })
  },
})
