import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { loginSchema } from '#/lib/schemas'
import type { LoginFormData } from '#/lib/schemas'
import { useLogin, useGoogleLogin } from '#/hooks/useAuth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const googleLogin = useGoogleLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    await login.mutateAsync(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
      <Button
        variant={'ghost'}
        className="flex absolute top-4 left-4 h-10 w-10"
        onClick={() => navigate({ to: '/' })}
      >
        <ArrowLeft />
      </Button>

      <div className="w-full max-w-130 rounded-3xl p-6 sm:p-8">
        <div className="mb-7 flex flex-col items-center gap-10 text-center">
          <img src="/logo-icon.svg" alt="hum.ai logo" className="size-15" />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => googleLogin.mutate()}
            disabled={googleLogin.isPending}
            className="h-14 w-full rounded-full border-[#d4d4d8] bg-transparent text-base gap-6"
          >
            <img src="https://logos.hunter.io/google.com" className="h-5 w-5" />
            Sign in with Google
          </Button>

          <div className="flex items-center gap-4 py-1 text-sm text-muted-foreground">
            <div className="h-px flex-1 bg-[#d9d9de]" />
            <span className="font-semibold text-foreground">or</span>
            <div className="h-px flex-1 bg-[#d9d9de]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              {...register('email')}
              className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
            />
            {errors.email && (
              <p className="px-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}

            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              {...register('password')}
              className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
            />
            {errors.password && (
              <p className="px-1 text-sm text-destructive">
                {errors.password.message}
              </p>
            )}

            {login.error && (
              <p className="px-1 text-sm text-destructive">
                {login.error.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={login.isPending}
              className="h-14 w-full rounded-full bg-[#02040b] text-base font-semibold text-white hover:bg-black/90"
            >
              {login.isPending ? 'Logging in...' : 'Continue'}
            </Button>
          </form>

          <p className="px-3 text-center text-sm text-[#8d919a]">
            By proceeding, you accept the{' '}
            <a href="/terms#terms" className="underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="/terms#privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>

          <p className="pt-6 text-center text-sm font-medium text-foreground">
            Need an account?{' '}
            <button
              type="button"
              onClick={() => navigate({ to: '/register' })}
              className="underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
