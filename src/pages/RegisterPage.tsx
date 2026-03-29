import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useRegister, useGoogleLogin } from '#/hooks/useAuth'
import { registerSchema } from '#/lib/schemas'
import type { RegisterFormData } from '#/lib/schemas'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

type Step = 'email' | 'name' | 'password'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const googleLogin = useGoogleLogin()

  const [step, setStep] = useState<Step>('email')
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false)

  const {
    register: field,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const advanceFromEmail = async () => {
    const valid = await trigger('email')
    if (valid) setStep('name')
  }

  const advanceFromName = async () => {
    const valid = await trigger(['first_name', 'last_name'])
    if (valid) setStep('password')
  }

  const goBack = () => {
    if (step === 'name') setStep('email')
    else if (step === 'password') setStep('name')
  }

  const onSubmit = async (data: RegisterFormData) => {
    const result = await register.mutateAsync(data)
    if (!result.session) {
      setEmailConfirmationSent(true)
    }
  }

  const email = getValues('email')

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex h-10 w-10"
        onClick={() => (step === 'email' ? navigate({ to: '/' }) : goBack())}
      >
        <ArrowLeft />
      </Button>
      <div className="w-full max-w-130 rounded-3xl p-6 sm:p-8">
        <div className="mb-7 flex flex-col items-center gap-10 text-center">
          <img src="/logo-icon.svg" alt="hum.ai logo" className="size-15" />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Create an account to register your devices
          </h1>
        </div>

        {emailConfirmationSent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Check your inbox at{' '}
              <span className="font-medium text-foreground">{email}</span> and
              click the confirmation link to activate your account.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/login' })}
              className="h-14 w-full rounded-full"
            >
              Back to login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {step === 'email' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => googleLogin.mutate()}
                  disabled={googleLogin.isPending}
                  className="h-14 w-full rounded-full border-[#d4d4d8] bg-transparent text-base gap-6"
                >
                  <img
                    src="https://logos.hunter.io/google.com"
                    className="h-5 w-5"
                  />
                  Sign up with Google
                </Button>
                <div className="flex items-center gap-4 py-1 text-sm text-muted-foreground">
                  <div className="h-px flex-1 bg-[#d9d9de]" />
                  <span className="font-semibold text-foreground">or</span>
                  <div className="h-px flex-1 bg-[#d9d9de]" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {step === 'email' && (
                <>
                  <Input
                    type="email"
                    placeholder="Enter Your Email"
                    {...field('email')}
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                  {errors.email && (
                    <p className="px-1 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                  <Button
                    type="button"
                    onClick={advanceFromEmail}
                    className="h-14 w-full rounded-full bg-[#02040b] text-base font-semibold text-white hover:bg-black/90"
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === 'name' && (
                <>
                  <Input
                    type="text"
                    placeholder="First Name"
                    autoFocus
                    {...field('first_name')}
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                  {errors.first_name && (
                    <p className="px-1 text-sm text-destructive">
                      {errors.first_name.message}
                    </p>
                  )}
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...field('last_name')}
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                  {errors.last_name && (
                    <p className="px-1 text-sm text-destructive">
                      {errors.last_name.message}
                    </p>
                  )}
                  <Button
                    type="button"
                    onClick={advanceFromName}
                    className="h-14 w-full rounded-full bg-[#02040b] text-base font-semibold text-white hover:bg-black/90"
                  >
                    Continue
                  </Button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="w-full text-center text-sm font-medium text-foreground underline"
                  >
                    Go back
                  </button>
                </>
              )}

              {step === 'password' && (
                <>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                  <Input
                    type="password"
                    placeholder="Create Password"
                    {...field('password')}
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                  {errors.password && (
                    <p className="px-1 text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                  {register.error && (
                    <p className="px-1 text-sm text-destructive">
                      {register.error.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={register.isPending}
                    className="h-14 w-full rounded-full bg-[#02040b] text-base font-semibold text-white hover:bg-black/90"
                  >
                    {register.isPending
                      ? 'Creating account...'
                      : 'Create Account'}
                  </Button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="w-full text-center text-sm font-medium text-foreground underline"
                  >
                    Go back
                  </button>
                </>
              )}
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
              Already a user?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="underline"
              >
                Log in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
