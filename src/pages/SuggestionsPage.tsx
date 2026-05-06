import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import { Button } from '#/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import { useFetch, useCreate } from '#/shared/hooks/useApi'

interface SuggestionResponse {
  id: string
  title: string
  body: string
  user_id: string | null
  created_at: string
}

interface CreateSuggestionRequest {
  title: string
  body: string
}

export function SuggestionsPage() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    data: suggestions,
    isLoading,
    error: fetchError,
  } = useFetch<SuggestionResponse[]>({
    url: '/suggestions',
    retry: false,
  })

  const { mutate: submit, isPending } = useCreate<
    SuggestionResponse,
    CreateSuggestionRequest
  >('/suggestions')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitError(null)
    setSubmitSuccess(false)

    submit(
      { title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setTitle('')
          setBody('')
          setSubmitSuccess(true)
          queryClient.invalidateQueries({ queryKey: ['/suggestions'] })
        },
        onError: (err) => {
          const msg =
            (err.response?.data as { detail?: string } | undefined)?.detail ||
            err.message ||
            'Unknown error'
          setSubmitError(msg)
        },
      },
    )
  }

  return (
    <PlatformShell
      title="Suggestions"
      description="Submit feedback or feature requests to the team."
    >
      <div className="p-4 md:p-6 space-y-6 max-w-2xl">
        {/* Submit form */}
        <Card>
          <CardHeader>
            <CardTitle>New Suggestion</CardTitle>
            <CardDescription>
              Your submission will be saved to the database in real time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="suggestion-title">Title</Label>
                <Input
                  id="suggestion-title"
                  placeholder="Short summary…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="suggestion-body">Details</Label>
                <textarea
                  id="suggestion-body"
                  rows={4}
                  placeholder="Describe your suggestion in more detail…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <span className="font-medium">Error:</span> {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                  Suggestion submitted successfully!
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending || !title.trim() || !body.trim()}
              >
                {isPending ? 'Submitting…' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Suggestions list */}
        <div className="space-y-3">
          {fetchError ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span className="font-medium">Failed to load suggestions:</span>{' '}
              {(
                fetchError as {
                  response?: { data?: { detail?: string } }
                  message?: string
                }
              ).response?.data?.detail ?? fetchError.message}
            </div>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !suggestions?.length ? (
            <p className="text-sm text-muted-foreground">
              No suggestions yet. Be the first!
            </p>
          ) : (
            suggestions.map((s) => (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription>
                    {new Date(s.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {s.body}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PlatformShell>
  )
}
