import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRegister, useGoogleLogin } from '#/hooks/useAuth'
import { registerSchema } from '#/lib/schemas'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const googleLogin = useGoogleLogin()

  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false)

  const handleContinue = () => {
    const result = registerSchema.shape.email.safeParse(email.trim())
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Invalid email')
      return
    }
    setValidationError('')
    setStep('password')
  }

  const handleCreateAccount = async () => {
    const result = registerSchema.shape.password.safeParse(password)
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Invalid password')
      return
    }
    setValidationError('')

    const data = await register.mutateAsync({ email, password })
    if (!data.session) {
      setEmailConfirmationSent(true)
    }
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

            <div className="space-y-3">
              {step === 'email' ? (
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="Enter Your Email"
                  className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                />
              ) : (
                <>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      if (validationError) setValidationError('')
                    }}
                    placeholder="Create Password"
                    className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
                  />
                </>
              )}

              {(validationError || register.error) && (
                <p className="px-1 text-sm text-destructive">
                  {validationError || register.error?.message}
                </p>
              )}

              <Button
                type="button"
                disabled={register.isPending || googleLogin.isPending}
                onClick={
                  step === 'email' ? handleContinue : handleCreateAccount
                }
                className="h-14 w-full rounded-full bg-[#02040b] text-base font-semibold text-white hover:bg-black/90"
              >
                {register.isPending
                  ? 'Creating account...'
                  : step === 'email'
                    ? 'Continue'
                    : 'Create Account'}
              </Button>

              {step === 'password' && (
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setPassword('')
                    setValidationError('')
                  }}
                  className="w-full text-center text-sm font-medium text-foreground underline"
                >
                  Use a different email
                </button>
              )}
            </div>

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

            <p className="pt-6 text-center text-sm   font-medium text-foreground">
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
