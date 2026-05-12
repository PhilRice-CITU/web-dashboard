import { Link } from '@tanstack/react-router'
import { Loader2Icon, CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import { buttonVariants } from '#/shared/components/ui/button'
import { cn } from '#/shared/lib/utils'
import type { ApiResult } from '#/shared/api/contracts'

type Props = {
  resultId: string
  result: ApiResult | undefined
  annotatedUrl: string | null | undefined
  isPolling: boolean
  elapsedSeconds: number
}

export function GradingResultPanel({
  resultId,
  result,
  annotatedUrl,
  isPolling,
  elapsedSeconds,
}: Props) {
  const status = result?.status ?? 'pending'
  const isTerminal = status === 'graded' || status === 'corrected'
  const isFailed = status === 'failed'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <StatusPill status={status} isPolling={isPolling} />
        <span className="text-xs text-muted-foreground">
          Elapsed {elapsedSeconds}s · result {resultId.slice(0, 8)}…
        </span>
      </div>

      {isFailed && result?.grading_error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <p className="font-medium">Grading failed</p>
          <p className="mt-1 font-mono text-xs">{result.grading_error}</p>
        </div>
      )}

      {isTerminal && result?.metrics && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCell label="Grade" value={result.metrics.rawGrade ?? '—'} />
          <MetricCell
            label="Total grains"
            value={
              result.metrics.perGrain
                ? String(result.metrics.perGrain.length)
                : '—'
            }
          />
          <MetricCell label="Operator" value={result.operator_name ?? '—'} />
          <MetricCell label="Variety" value={result.rice_variety ?? '—'} />
        </div>
      )}

      {isTerminal && annotatedUrl && (
        <div className="overflow-hidden rounded-md border border-border bg-muted">
          <img
            src={annotatedUrl}
            alt="Annotated grading preview"
            className="h-auto w-full"
          />
        </div>
      )}

      {isTerminal && (
        <Link
          to="/scans/$scanId"
          params={{ scanId: resultId }}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          View full result →
        </Link>
      )}
    </div>
  )
}

function StatusPill({
  status,
  isPolling,
}: {
  status: string
  isPolling: boolean
}) {
  const palette: Record<string, string> = {
    pending: 'border-amber-500/40 bg-amber-500/10 text-amber-700',
    processing: 'border-blue-500/40 bg-blue-500/10 text-blue-700',
    graded: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
    corrected: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
    failed: 'border-destructive/40 bg-destructive/10 text-destructive',
  }
  const Icon =
    status === 'graded' || status === 'corrected'
      ? CheckCircle2Icon
      : status === 'failed'
        ? XCircleIcon
        : Loader2Icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        palette[status] ?? palette.pending,
      )}
    >
      <Icon
        className={cn(
          'size-3.5',
          isPolling && status !== 'failed' && 'animate-spin',
        )}
      />
      {status}
    </span>
  )
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </div>
    </div>
  )
}
