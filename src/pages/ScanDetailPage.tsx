import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { CorrectionHistory } from '#/features/scans/components/CorrectionHistory'
import { GradeOverrideDialog } from '#/features/scans/components/GradeOverrideDialog'
import { GradingBreakdown } from '#/features/scans/components/GradingBreakdown'
import { GrainCorrectionPanel } from '#/features/scans/components/GrainCorrectionPanel'
import { ScanImageViewer } from '#/features/scans/components/ScanImageViewer'
import { PnsThresholdTable } from '#/features/scans/components/PnsThresholdTable'
import { useScanDetail } from '#/features/scans/hooks/useScanDetail'
import { Badge } from '#/shared/components/ui/badge'
import { Button } from '#/shared/components/ui/button'
import { PlatformShell } from '#/shared/components/layout/PlatformShell'

export function ScanDetailPage() {
  const { scanId } = useParams({ from: '/_authenticated/scans/$scanId' })
  const { data: result, isLoading, error } = useScanDetail(scanId)
  const [selectedGrainId, setSelectedGrainId] = useState<number | null>(null)

  return (
    <PlatformShell
      title="Scan detail"
      description={scanId}
      actions={
        <Button variant="ghost" size="sm" render={<Link to="/results" />}>
          <ArrowLeft className="mr-1 size-4" />
          Back to results
        </Button>
      }
    >
      <div className="mx-auto w-full max-w-350 px-4 py-6 md:px-6">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && (
          <p className="text-sm text-destructive">Failed to load scan.</p>
        )}
        {result && (
          <ScanDetailBody
            result={result}
            resultId={scanId}
            selectedGrainId={selectedGrainId}
            onSelectGrain={setSelectedGrainId}
          />
        )}
      </div>
    </PlatformShell>
  )
}

type BodyProps = {
  result: ReturnType<typeof useScanDetail>['data'] & object
  resultId: string
  selectedGrainId: number | null
  onSelectGrain: (id: number | null) => void
}

function ScanDetailBody({
  result,
  resultId,
  selectedGrainId,
  onSelectGrain,
}: BodyProps) {
  const status = result.status ?? 'pending'
  const isReady = status === 'graded' || status === 'corrected'
  const perGrain = result.metrics?.perGrain ?? []

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      <section className="space-y-4">
        <div className="mx-auto w-full max-w-3xl">
          <ScanImageViewer
            resultId={resultId}
            perGrain={perGrain}
            selectedGrainId={selectedGrainId}
            onSelectGrain={onSelectGrain}
          />
        </div>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              status === 'failed'
                ? 'destructive'
                : isReady
                  ? 'secondary'
                  : 'outline'
            }
          >
            {status}
          </Badge>
          {isReady && result.metrics && (
            <GradeOverrideDialog
              resultId={resultId}
              currentGrade={result.metrics.rawGrade}
            />
          )}
        </div>

        {status === 'failed' && result.grading_error && (
          <div className="rounded border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
            {result.grading_error}
          </div>
        )}

        {!isReady && status !== 'failed' && (
          <p className="text-sm text-muted-foreground">
            Grading is in progress. This page will refresh automatically.
          </p>
        )}

        {isReady && result.metrics && (
          <>
            <GradingBreakdown result={result} />
            <PnsThresholdTable metrics={result.metrics} />
            <GrainCorrectionPanel
              resultId={resultId}
              perGrain={perGrain}
              selectedGrainId={selectedGrainId}
              onClearSelection={() => onSelectGrain(null)}
            />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold">Correction history</h3>
              <CorrectionHistory resultId={resultId} />
            </section>
          </>
        )}
      </aside>
    </div>
  )
}
