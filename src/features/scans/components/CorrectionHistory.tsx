import { useCorrectionHistory } from '#/features/scans/hooks/useScanDetail'
import type { ApiCorrectionHistoryItem } from '#/shared/api/contracts'

type Props = { resultId: string }

export function CorrectionHistory({ resultId }: Props) {
  const { data, isLoading } = useCorrectionHistory(resultId)

  if (isLoading) {
    return <p className="text-xs text-muted-foreground">Loading history…</p>
  }
  if (!data || data.count === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No corrections recorded for this scan.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {data.data.map((item) => (
        <CorrectionRow key={item.id} item={item} />
      ))}
    </ul>
  )
}

function CorrectionRow({ item }: { item: ApiCorrectionHistoryItem }) {
  const when = new Date(item.created_at).toLocaleString()
  return (
    <li className="rounded border border-border bg-card p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {item.correction_type === 'grade_override'
            ? 'Grade override'
            : 'Grain reclassification'}
        </span>
        <span className="text-muted-foreground">{when}</span>
      </div>
      <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] text-muted-foreground">
        {JSON.stringify(item.payload, null, 2)}
      </pre>
    </li>
  )
}
