import { useMemo, useState } from 'react'

import { useApplyGrainCorrections } from '#/features/scans/hooks/useScanDetail'
import { GRAIN_CLASSES } from '#/features/scans/types'
import type { GrainClass } from '#/features/scans/types'
import { axiosErrorDetail } from '#/features/scans/utils'
import type { ApiPerGrain } from '#/shared/api/contracts'
import { Button } from '#/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'

type Props = {
  resultId: string
  perGrain: ApiPerGrain[]
  selectedGrainId: number | null
  onClearSelection: () => void
}

export function GrainCorrectionPanel({
  resultId,
  perGrain,
  selectedGrainId,
  onClearSelection,
}: Props) {
  const [pendingEdits, setPendingEdits] = useState<Map<number, GrainClass>>(
    new Map(),
  )
  const apply = useApplyGrainCorrections(resultId)

  const selected = useMemo(
    () =>
      selectedGrainId === null
        ? null
        : (perGrain.find((g) => g.grain_id === selectedGrainId) ?? null),
    [perGrain, selectedGrainId],
  )

  const editsArray = useMemo(
    () =>
      Array.from(pendingEdits, ([grain_id, to_class]) => ({
        grain_id,
        to_class,
      })),
    [pendingEdits],
  )

  const stage = (grainId: number, toClass: GrainClass) => {
    setPendingEdits((prev) => {
      const next = new Map(prev)
      const original = perGrain.find((g) => g.grain_id === grainId)
      if (original?.class_label === toClass) {
        next.delete(grainId)
      } else {
        next.set(grainId, toClass)
      }
      return next
    })
  }

  const handleSave = () => {
    if (editsArray.length === 0) return
    apply.mutate(
      { edits: editsArray },
      {
        onSuccess: () => {
          setPendingEdits(new Map())
          onClearSelection()
        },
      },
    )
  }

  return (
    <section className="space-y-3 rounded-lg border border-border bg-card p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Grain corrections</h3>
        <span className="text-xs text-muted-foreground">
          {pendingEdits.size} pending
        </span>
      </header>

      {selected ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Grain #{selected.grain_id} • current:{' '}
            <span className="font-mono">{selected.class_label}</span>
          </p>
          <Select
            value={pendingEdits.get(selected.grain_id) ?? selected.class_label}
            onValueChange={(value) =>
              stage(selected.grain_id, value as GrainClass)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRAIN_CLASSES.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Click a bbox in the Annotated view to reclassify a grain.
        </p>
      )}

      {editsArray.length > 0 && (
        <ul className="max-h-48 space-y-1 overflow-y-auto text-xs">
          {editsArray.map(({ grain_id, to_class }) => {
            const original = perGrain.find((g) => g.grain_id === grain_id)
            return (
              <li
                key={grain_id}
                className="flex items-center justify-between rounded bg-muted/40 px-2 py-1 font-mono"
              >
                <span>
                  #{grain_id}: {original?.class_label} → {to_class}
                </span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setPendingEdits((prev) => {
                      const next = new Map(prev)
                      next.delete(grain_id)
                      return next
                    })
                  }
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Button
        type="button"
        size="sm"
        className="w-full"
        disabled={editsArray.length === 0 || apply.isPending}
        onClick={handleSave}
      >
        {apply.isPending
          ? 'Saving…'
          : `Save ${editsArray.length} correction(s)`}
      </Button>

      {apply.error && (
        <p className="text-xs text-destructive">
          {axiosErrorDetail(apply.error, 'Failed to save corrections')}
        </p>
      )}
    </section>
  )
}
