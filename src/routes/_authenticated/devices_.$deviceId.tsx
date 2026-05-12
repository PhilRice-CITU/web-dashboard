import { createFileRoute } from '@tanstack/react-router'
import { DevicePage } from '#/pages/DevicePage'

export const Route = createFileRoute('/_authenticated/devices_/$deviceId')({
  head: () => ({
    meta: [{ title: 'hum.ai | Device' }],
  }),
  component: DevicePage,
})
