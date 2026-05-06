import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/lib/supabase'
import { sessionQueryKey } from '#/features/auth/hooks/useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  return <>{children}</>
}
