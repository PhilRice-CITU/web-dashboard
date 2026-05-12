import { useEffect, useMemo, useState } from 'react'
import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import { useCurrentUser } from '#/features/auth/hooks/useCurrentUser'
import { useDeviceFleet } from '#/features/devices/hooks/useDeviceFleet'
import { DeviceSelector } from '#/features/test-grading/components/DeviceSelector'
import {
  PairUploadList,
  allPairsComplete,
  makeEmptyPair,
} from '#/features/test-grading/components/PairUploadList'
import { GradingResultPanel } from '#/features/test-grading/components/GradingResultPanel'
import { useSubmitTestSession } from '#/features/test-grading/hooks/useSubmitTestSession'
import { useGradedResult } from '#/features/test-grading/hooks/useGradedResult'
import type { UploadPair } from '#/features/test-grading/types'

export function TestGradingPage() {
  const { isSuperadmin, isLoading: userLoading } = useCurrentUser()
  const { devices, isDevicesLoading } = useDeviceFleet(null)

  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [operatorName, setOperatorName] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [riceVariety, setRiceVariety] = useState('')
  const [pairs, setPairs] = useState<UploadPair[]>(() => [makeEmptyPair()])

  const submit = useSubmitTestSession()
  const resultId = submit.data?.resultId ?? null
  const graded = useGradedResult(resultId)
  const elapsed = useElapsedSeconds(submit.isPending || graded.isPolling)

  useEffect(() => {
    if (!deviceId && devices[0]) setDeviceId(devices[0].id)
  }, [devices, deviceId])

  const canSubmit = useMemo(
    () =>
      !!deviceId &&
      operatorName.trim().length > 0 &&
      allPairsComplete(pairs) &&
      !submit.isPending,
    [deviceId, operatorName, pairs, submit.isPending],
  )

  if (userLoading) {
    return (
      <PlatformShell title="Test Grading">
        <div className="p-6 text-sm text-muted-foreground">Loading…</div>
      </PlatformShell>
    )
  }

  if (!isSuperadmin) {
    return (
      <PlatformShell title="Test Grading">
        <div className="p-6 text-sm text-muted-foreground">
          This page is restricted to superadmins.
        </div>
      </PlatformShell>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !deviceId) return
    submit.mutate({
      deviceId,
      meta: {
        operator_name: operatorName.trim(),
        session_name: sessionName.trim() || undefined,
        rice_variety: riceVariety.trim() || undefined,
      },
      pairs,
    })
  }

  const handleReset = () => {
    submit.reset()
    setPairs([makeEmptyPair()])
  }

  return (
    <PlatformShell
      title="Test Grading"
      description="Simulate an edge device — upload IR + white-LED image pairs to evaluate the model."
    >
      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border bg-card p-4"
        >
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              Session details
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="device">Device</Label>
              <DeviceSelector
                devices={devices}
                value={deviceId}
                onChange={setDeviceId}
                disabled={submit.isPending}
                isLoading={isDevicesLoading}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="operator">Operator name</Label>
                <Input
                  id="operator"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="e.g. web-tester"
                  disabled={submit.isPending}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="session">Session name (optional)</Label>
                <Input
                  id="session"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. smoke-test-1"
                  disabled={submit.isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="variety">Rice variety (optional)</Label>
              <Input
                id="variety"
                value={riceVariety}
                onChange={(e) => setRiceVariety(e.target.value)}
                placeholder="e.g. Jasmine"
                disabled={submit.isPending}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              Image pairs
            </h2>
            <p className="text-xs text-muted-foreground">
              Each pair = one white-LED capture + matching IR capture. All pairs
              are graded together as one consolidated result.
            </p>
            <PairUploadList
              pairs={pairs}
              onChange={setPairs}
              disabled={submit.isPending}
            />
          </section>

          {submit.error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
              {submit.error instanceof Error
                ? submit.error.message
                : 'Submission failed'}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={!canSubmit}>
              {submit.isPending ? 'Submitting…' : 'Submit for grading'}
            </Button>
            {resultId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={graded.isPolling}
              >
                New test
              </Button>
            )}
          </div>
        </form>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Result</h2>
          {resultId ? (
            <GradingResultPanel
              resultId={resultId}
              result={graded.result}
              annotatedUrl={graded.annotatedUrl}
              isPolling={graded.isPolling}
              elapsedSeconds={elapsed}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Submit a session to see the graded result here.
            </p>
          )}
        </div>
      </div>
    </PlatformShell>
  )
}

function useElapsedSeconds(active: boolean): number {
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (active && start === null) {
      setStart(Date.now())
    }
    if (!active) {
      setStart(null)
      return
    }
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [active, start])

  if (start === null) return 0
  return Math.floor((now - start) / 1000)
}
