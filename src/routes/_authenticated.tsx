import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '#/shared/lib/supabase'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <Outlet />,
})
