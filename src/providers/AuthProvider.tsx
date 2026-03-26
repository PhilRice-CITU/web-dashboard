import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { useAppStore } from '#/store/appStore'
import { sessionQueryKey } from '#/hooks/useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const setUser = useAppStore((state) => state.setUser)
  const logout = useAppStore((state) => state.logout)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { user } = session
        setUser({
          id: user.id,
          name:
            (user.user_metadata.name as string | undefined) ??
            (user.user_metadata.full_name as string | undefined) ??
            user.email?.split('@')[0] ??
            'User',
          email: user.email ?? '',
          role:
            (user.user_metadata.role as
              | 'admin'
              | 'user'
              | 'viewer'
              | undefined) ?? 'user',
        })
      } else {
        logout()
      }
      queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    })

    return () => subscription.unsubscribe()
  }, [setUser, logout, queryClient])

  return <>{children}</>
}
