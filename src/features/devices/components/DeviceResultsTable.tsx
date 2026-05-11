import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '#/shared/components/ui/badge'
import { Button } from '#/shared/components/ui/button'
import { useDeviceResults } from '../hooks/useDeviceResults'

const PAGE_SIZE = 20

export function DeviceResultsTable({ deviceId }: { deviceId: string }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useDeviceResults(
    deviceId,
    page,
    PAGE_SIZE,
  )

  const rows = data?.data ?? []
  const total = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-base font-semibold">Recent Scans</h3>
        <span className="text-xs text-muted-foreground">{total} total</span>
      </div>

      {isLoading && (
        <div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>
      )}

      {isError && (
        <div className="px-4 py-6 text-sm text-rose-700">
          Failed to load scans for this device.
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          No scans recorded yet.
        </div>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Variety</th>
                <th className="px-4 py-2">Operator</th>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => {
                const grade = r.metrics.qualityGrade ?? '—'
                const when = r.graded_at ?? r.created_at
                return (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2 text-foreground">
                      {new Date(when).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.rice_variety ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.operator_name ?? '—'}
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="secondary">{grade}</Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.status ?? 'pending'}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to="/scans/$scanId"
                        params={{ scanId: r.id }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
