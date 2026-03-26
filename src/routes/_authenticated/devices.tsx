import { createFileRoute } from '@tanstack/react-router'
import { DevicesPage } from '#/pages/DevicesPage'

export const Route = createFileRoute('/_authenticated/devices')({
  head: () => ({
    meta: [{ title: 'hum.ai | Devices' }],
  }),
  component: DevicesPage,
})
