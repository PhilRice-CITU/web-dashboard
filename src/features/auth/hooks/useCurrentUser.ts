import { useQuery } from '@tanstack/react-query'
import { supabase } from '#/shared/lib/supabase'

type UserProfile = {
  role: 'superadmin' | 'admin'
  region_id: string | null
  name: string
  email: string
}

export function useCurrentUser() {
  const { data, isLoading, error } = useQuery<UserProfile | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return null
      const { data: userRow, error: userError } = await supabase
        .from('users')
        .select('role, region_id')
        .eq('id', session.user.id)
        .single()
      if (userError) throw userError
      return {
        role: userRow.role,
        region_id: userRow.region_id,
        name:
          (session.user.user_metadata.name as string | undefined) ??
          (session.user.user_metadata.full_name as string | undefined) ??
          session.user.email?.split('@')[0] ??
          'User',
        email: session.user.email ?? '',
      } as UserProfile
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    role: data?.role ?? null,
    regionId: data?.region_id ?? null,
    name: data?.name ?? '',
    email: data?.email ?? '',
    isSuperadmin: data?.role === 'superadmin',
    isLoading,
    error,
  }
}
