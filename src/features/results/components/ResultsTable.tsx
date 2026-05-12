import { useNavigate } from '@tanstack/react-router'
import type { ApiResult } from '#/shared/api/contracts'
import { GradeBadge } from './GradeBadge'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { cn } from '#/shared/lib/utils'

type Props = {
  results: ApiResult[]
  isLoading: boolean
  error: unknown
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'text-muted-foreground',
  processing: 'text-yellow-600',
  graded: 'text-green-600',
  corrected: 'text-blue-600',
  failed: 'text-destructive',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ResultsTable({ results, isLoading, error }: Props) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="p-4 text-sm text-destructive">
        Failed to load results. Check that the API server is running.
      </p>
    )
  }

  if (results.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        No results match your filters.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Grade</th>
            <th className="px-4 py-2 text-left font-medium">Limiting factor</th>
            <th className="px-4 py-2 text-left font-medium">Device</th>
            <th className="px-4 py-2 text-left font-medium">Operator</th>
            <th className="px-4 py-2 text-left font-medium">Captured</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {results.map((r) => (
            <tr
              key={r.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() =>
                navigate({ to: '/scans/$scanId', params: { scanId: r.id } })
              }
            >
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'text-xs font-medium capitalize',
                    STATUS_CLASS[r.status ?? 'pending'],
                  )}
                >
                  {r.status ?? 'pending'}
                </span>
              </td>
              <td className="px-4 py-3">
                <GradeBadge
                  grade={r.metrics.qualityGrade}
                  overridden={r.metrics.gradeOverridden}
                />
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {r.metrics.limitingFactor ?? '—'}
              </td>
              <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                {r.device_id.slice(0, 8)}…
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {r.operator_name ?? '—'}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatDate(r.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
