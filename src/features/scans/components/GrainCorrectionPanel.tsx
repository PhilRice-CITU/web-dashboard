import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { useApplyGrainCorrections } from '#/features/scans/hooks/useScanDetail'
import { DIMENSIONAL_CLASSES, VISUAL_CLASSES } from '#/features/scans/types'
import type { DimensionalClass, VisualClass } from '#/features/scans/types'
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

type PendingEdit = {
  visual_class: VisualClass
  dimensional_class: DimensionalClass
}

const NON_RICE = new Set<VisualClass>(['foreign', 'paddy'])

function visualOf(grain: ApiPerGrain): VisualClass {
  const value = grain.visual_class ?? grain.class_label
  return VISUAL_CLASSES.includes(value as VisualClass)
    ? (value as VisualClass)
    : 'clear'
}

function dimensionOf(grain: ApiPerGrain): DimensionalClass {
  const value = grain.dimensional_class ?? grain.class_label
  return DIMENSIONAL_CLASSES.includes(value as DimensionalClass)
    ? (value as DimensionalClass)
    : 'whole'
}

export function GrainCorrectionPanel({
  resultId,
  perGrain,
  selectedGrainId,
  onClearSelection,
}: Props) {
  const [pendingEdits, setPendingEdits] = useState<Map<number, PendingEdit>>(
    new Map(),
  )
  const queryClient = useQueryClient()
  const apply = useApplyGrainCorrections(resultId)

  const errorDetail = apply.error
    ? axiosErrorDetail(apply.error, 'Failed to save corrections')
    : null
  const isStaleError = errorDetail?.includes('No effective changes') ?? false

  const refreshResult = () => {
    queryClient.invalidateQueries({ queryKey: ['result', resultId] })
    setPendingEdits(new Map())
    apply.reset()
    onClearSelection()
  }

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
        to_visual_class: to_class.visual_class,
        to_dimensional_class: NON_RICE.has(to_class.visual_class)
          ? 'non_rice'
          : to_class.dimensional_class,
      })),
    [pendingEdits],
  )

  const stage = (grainId: number, patch: Partial<PendingEdit>) => {
    setPendingEdits((prev) => {
      const next = new Map(prev)
      const original = perGrain.find((g) => g.grain_id === grainId)
      if (!original) return next
      const current = next.get(grainId) ?? {
        visual_class: visualOf(original),
        dimensional_class: dimensionOf(original),
      }
      const staged = { ...current, ...patch }
      if (NON_RICE.has(staged.visual_class)) {
        staged.dimensional_class = 'whole'
      }
      if (
        visualOf(original) === staged.visual_class &&
        dimensionOf(original) === staged.dimensional_class
      ) {
        next.delete(grainId)
      } else {
        next.set(grainId, staged)
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
            <span className="font-mono">
              {visualOf(selected)} / {dimensionOf(selected)}
            </span>
          </p>
          {(() => {
            const staged = pendingEdits.get(selected.grain_id) ?? {
              visual_class: visualOf(selected),
              dimensional_class: dimensionOf(selected),
            }
            return (
              <div className="grid gap-2 sm:grid-cols-2">
                <Select
                  value={staged.visual_class}
                  onValueChange={(value) =>
                    stage(selected.grain_id, {
                      visual_class: value as VisualClass,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISUAL_CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={staged.dimensional_class}
                  disabled={NON_RICE.has(staged.visual_class)}
                  onValueChange={(value) =>
                    stage(selected.grain_id, {
                      dimensional_class: value as DimensionalClass,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIMENSIONAL_CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })()}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Click a bbox in the Annotated view to reclassify a grain.
        </p>
      )}

      {editsArray.length > 0 && (
        <ul className="max-h-48 space-y-1 overflow-y-auto text-xs">
          {editsArray.map(
            ({ grain_id, to_visual_class, to_dimensional_class }) => {
              const original = perGrain.find((g) => g.grain_id === grain_id)
              if (!original) return null
              return (
                <li
                  key={grain_id}
                  className="flex items-center justify-between rounded bg-muted/40 px-2 py-1 font-mono"
                >
                  <span>
                    #{grain_id}: {visualOf(original)} / {dimensionOf(original)}{' '}
                    → {to_visual_class} / {to_dimensional_class}
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
            },
          )}
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

      {errorDetail && (
        <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {isStaleError ? (
            <>
              <p className="text-xs text-destructive">
                These grains are already at the target class — your view is out
                of date. Someone (or another tab) likely corrected this scan
                already.
              </p>
              <button
                type="button"
                onClick={refreshResult}
                className="text-xs font-medium text-destructive underline underline-offset-2 hover:no-underline"
              >
                Refresh scan data
              </button>
            </>
          ) : (
            <p className="text-xs text-destructive">{errorDetail}</p>
          )}
        </div>
      )}
    </section>
  )
}
