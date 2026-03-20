import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '#/pages/LoginPage'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: 'hum.ai | Login' }],
  }),
  component: LoginPage,
})
