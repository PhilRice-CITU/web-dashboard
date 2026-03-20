import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '#/pages/RegisterPage'

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [{ title: 'hum.ai | Register' }],
  }),
  component: RegisterPage,
})
