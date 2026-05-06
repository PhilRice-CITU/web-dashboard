import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '#/shared/lib/supabase'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { completeProfileSchema } from '#/features/auth/schemas/auth.schemas'

export function CompleteProfilePage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    const firstResult = completeProfileSchema.shape.first_name.safeParse(
      firstName.trim(),
    )
    if (!firstResult.success) {
      setValidationError(
        firstResult.error.issues[0]?.message ?? 'First name required',
      )
      return
    }
    const lastResult = completeProfileSchema.shape.last_name.safeParse(
      lastName.trim(),
    )
    if (!lastResult.success) {
      setValidationError(
        lastResult.error.issues[0]?.message ?? 'Last name required',
      )
      return
    }

    setValidationError('')
    setIsSubmitting(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      navigate({ to: '/login', replace: true })
      return
    }

    const { error } = await supabase.from('users').upsert({
      id: session.user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      role: (session.user.user_metadata.role as string | undefined) ?? 'admin',
    })

    if (error) {
      setIsSubmitting(false)
      setValidationError(error.message)
      return
    }

    // Update auth metadata so the callback can route correctly on the next login
    await supabase.auth.updateUser({
      data: { first_name: firstName.trim(), last_name: lastName.trim() },
    })

    setIsSubmitting(false)

    navigate({ to: '/dashboard', replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
      <div className="w-full max-w-130 rounded-3xl p-6 sm:p-8">
        <div className="mb-7 flex flex-col items-center gap-10 text-center">
          <img src="/logo-icon.svg" alt="hum.ai logo" className="size-15" />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              One last step
            </h1>
            <p className="text-sm text-muted-foreground">
              Tell us your name to complete your profile.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              if (validationError) setValidationError('')
            }}
            placeholder="First Name"
            className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
            autoFocus
          />
          <Input
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              if (validationError) setValidationError('')
            }}
            placeholder="Last Name"
            className="h-14 rounded-full border-[#e2e2e6] bg-[#ececf0] px-5 text-base"
          />

          {validationError && (
            <p className="px-1 text-sm text-destructive">{validationError}</p>
          )}

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="h-14 w-full rounded-full bg-[#02040b] text-base font-semibold text-white hover:bg-black/90"
          >
            {isSubmitting ? 'Saving…' : 'Continue to Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  )
}
