import { createFileRoute } from '@tanstack/react-router'
import { CompleteProfilePage } from '#/pages/CompleteProfilePage'

export const Route = createFileRoute('/auth/complete-profile')({
  head: () => ({
    meta: [{ title: 'hum.ai | Complete Your Profile' }],
  }),
  component: CompleteProfilePage,
})
