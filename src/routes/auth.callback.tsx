import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'

// Use auth metadata — no DB query, no RLS dependency.
// Email signup always sets first_name in metadata (passed via options.data).
// Google OAuth sets full_name; if absent, route to complete-profile.
function getRedirectTarget(user: {
  user_metadata: Record<string, unknown>
}): '/dashboard' | '/auth/complete-profile' {
  const meta = user.user_metadata
  const firstName =
    (meta.first_name as string | undefined)?.trim() ||
    (meta.full_name as string | undefined)?.split(' ')[0]?.trim() ||
    ''
  return firstName ? '/dashboard' : '/auth/complete-profile'
}

function AuthCallbackPage() {
  const navigate = useNavigate()

  const params = new URLSearchParams(
    window.location.search + '&' + window.location.hash.replace('#', ''),
  )
  const errorDescription = params.get('error_description')
  const errorCode = params.get('error_code')

  useEffect(() => {
    if (errorDescription) return

    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(async ({ data, error }) => {
          if (error) {
            navigate({ to: '/login', replace: true })
          } else {
            const target = getRedirectTarget(data.session.user)
            navigate({ to: target, replace: true })
          }
        })
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const target = getRedirectTarget(session.user)
        navigate({ to: target, replace: true })
        return
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          subscription.unsubscribe()
          const target = getRedirectTarget(newSession.user)
          navigate({ to: target, replace: true })
        } else if (event === 'SIGNED_OUT') {
          subscription.unsubscribe()
          navigate({ to: '/login', replace: true })
        }
      })
      return () => subscription.unsubscribe()
    })
  }, [navigate, errorDescription])

  if (errorDescription) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f3f3f3] px-4">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-destructive">
            Sign-in failed
          </h2>
          <p className="text-sm text-muted-foreground">
            {decodeURIComponent(errorDescription.replace(/\+/g, ' '))}
          </p>
          {errorCode && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              code: {errorCode}
            </p>
          )}
          <a
            href="/login"
            className="mt-4 inline-block text-sm underline text-foreground"
          >
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f3f3f3]">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
      <p className="text-xs text-muted-foreground">
        Taking too long?{' '}
        <a href="/login" className="underline">
          Back to login
        </a>
      </p>
    </div>
  )
}

export const Route = createFileRoute('/auth/callback')({
  head: () => ({
    meta: [{ title: 'hum.ai | Signing in…' }],
  }),
  component: AuthCallbackPage,
})
