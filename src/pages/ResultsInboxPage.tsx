import { useState } from 'react'
import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import { KpiStrip } from '#/features/results/components/KpiStrip'
import { ResultsTable } from '#/features/results/components/ResultsTable'
import {
  useResultsList,
  useDashboardSummary,
} from '#/features/results/hooks/useResultsInbox'
import { Input } from '#/shared/components/ui/input'
import { Button } from '#/shared/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

const PAGE_SIZE = 50

export function ResultsInboxPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const {
    data: resultsData,
    isLoading: resultsLoading,
    error,
  } = useResultsList({ page })

  const results = resultsData?.data ?? []
  const total = resultsData?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const filtered = search.trim()
    ? results.filter(
        (r) =>
          r.metrics.qualityGrade
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          r.metrics.limitingFactor
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          r.operator_name?.toLowerCase().includes(search.toLowerCase()) ||
          r.device_id.includes(search),
      )
    : results

  return (
    <PlatformShell
      title="Results"
      description="Reverse-chronological feed of graded rice scans."
    >
      <div className="space-y-4 px-4 py-6 md:px-6">
        <KpiStrip summary={summary} isLoading={summaryLoading} />

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search grade, factor, operator, device…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-lg border border-border bg-card">
          <ResultsTable
            results={filtered}
            isLoading={resultsLoading}
            error={error}
          />
        </div>

        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages} — {total} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeftIcon className="size-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}
