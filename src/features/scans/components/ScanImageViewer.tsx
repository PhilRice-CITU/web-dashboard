import { useState } from 'react'

import { BatchImageGallery } from '#/features/scans/components/BatchImageGallery'
import { useScanBatchImages } from '#/features/scans/hooks/useScanDetail'
import { CLASS_COLORS, DEFAULT_CLASS_COLOR } from '#/features/scans/types'
import type { ApiPerGrain, ResultImageVariant } from '#/shared/api/contracts'
import { Tabs, TabsList, TabsTab } from '#/shared/components/ui/tabs'

type Props = {
  resultId: string
  perGrain: ApiPerGrain[]
  selectedGrainId: number | null
  onSelectGrain: (grainId: number | null) => void
}

const TABS: ResultImageVariant[] = ['raw', 'ir', 'annotated', 'annotated_ir']

const TAB_LABELS: Record<ResultImageVariant, string> = {
  raw: 'Raw',
  ir: 'IR',
  annotated: 'Annotated',
  annotated_ir: 'Annotated IR',
}

export function ScanImageViewer({
  resultId,
  perGrain,
  selectedGrainId,
  onSelectGrain,
}: Props) {
  const [variant, setVariant] = useState<ResultImageVariant>('annotated')

  const [rawIrBatch, setRawIrBatch] = useState(0)
  const [annotatedBatch, setAnnotatedBatch] = useState(0)

  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(
    null,
  )

  const { data: batches, isLoading, error } = useScanBatchImages(resultId)

  const rawUrls =
    batches?.map((b) => b.raw).filter((u): u is string => !!u) ?? []
  const irUrls = batches?.map((b) => b.ir).filter((u): u is string => !!u) ?? []
  const annotatedUrls =
    batches?.map((b) => b.annotated).filter((u): u is string => !!u) ?? []
  const annotatedIrUrls =
    batches?.map((b) => b.annotated_ir).filter((u): u is string => !!u) ?? []

  const urlsForTab: Record<ResultImageVariant, string[]> = {
    raw: rawUrls,
    ir: irUrls,
    annotated: annotatedUrls,
    annotated_ir: annotatedIrUrls,
  }

  const selectedIndexForTab: Record<ResultImageVariant, number> = {
    raw: rawIrBatch,
    ir: rawIrBatch,
    annotated: annotatedBatch,
    annotated_ir: annotatedBatch,
  }

  const onSelectForTab: Record<ResultImageVariant, (i: number) => void> = {
    raw: setRawIrBatch,
    ir: setRawIrBatch,
    annotated: (i) => {
      setAnnotatedBatch(i)
      setImageSize(null)
    },
    annotated_ir: (i) => {
      setAnnotatedBatch(i)
      setImageSize(null)
    },
  }

  const currentUrls = urlsForTab[variant]
  const currentIndex = Math.min(
    selectedIndexForTab[variant],
    Math.max(0, currentUrls.length - 1),
  )
  const isAnnotated = variant === 'annotated' || variant === 'annotated_ir'

  const hasBatchNumber = perGrain.some((g) => g.batch_number != null)
  const currentBatchNumber = batches?.[currentIndex]?.batch
  const overlayGrains =
    isAnnotated && hasBatchNumber && currentBatchNumber != null
      ? perGrain.filter((g) => g.batch_number === currentBatchNumber)
      : []

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={variant}
        onValueChange={(v) => {
          const next = v as ResultImageVariant
          setVariant(next)
          if (next !== 'annotated' && next !== 'annotated_ir') {
            onSelectGrain(null)
          }
        }}
      >
        <TabsList>
          {TABS.map((tab) => (
            <TabsTab key={tab} value={tab}>
              {TAB_LABELS[tab]}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground">
          Loading images…
        </div>
      )}

      {error && (
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-muted/30 px-6 text-center text-sm text-destructive">
          Images not available yet.
        </div>
      )}

      {!isLoading && !error && currentUrls.length === 0 && (
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground">
          No images for this tab yet.
        </div>
      )}

      {!isLoading && !error && currentUrls.length > 0 && (
        <>
          <BatchImageGallery
            images={currentUrls}
            selectedIndex={currentIndex}
            onSelect={onSelectForTab[variant]}
            alt={TAB_LABELS[variant]}
            variantLabel={TAB_LABELS[variant]}
            onImageLoad={(w, h) => {
              if (isAnnotated) setImageSize({ w, h })
            }}
            overlay={
              isAnnotated && imageSize && overlayGrains.length > 0 ? (
                <BBoxOverlay
                  perGrain={overlayGrains}
                  imageSize={imageSize}
                  selectedGrainId={selectedGrainId}
                  onSelectGrain={onSelectGrain}
                />
              ) : null
            }
          />
          {isAnnotated && !hasBatchNumber && (
            <p className="text-xs text-muted-foreground">
              Interactive grain selection unavailable for scans graded before
              this update — the annotated image above is authoritative.
            </p>
          )}
        </>
      )}
    </div>
  )
}

type OverlayProps = {
  perGrain: ApiPerGrain[]
  imageSize: { w: number; h: number }
  selectedGrainId: number | null
  onSelectGrain: (grainId: number | null) => void
}

function BBoxOverlay({
  perGrain,
  imageSize,
  selectedGrainId,
  onSelectGrain,
}: OverlayProps) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${imageSize.w} ${imageSize.h}`}
      preserveAspectRatio="none"
    >
      {perGrain.map((grain) => {
        if (!grain.bbox_norm && !grain.bbox) return null
        const rawBbox = grain.bbox_norm ?? grain.bbox
        if (!rawBbox) return null
        const [bx1, by1, bx2, by2] = rawBbox
        const isNorm = grain.bbox_norm != null
        const x1 = isNorm ? bx1 * imageSize.w : bx1
        const y1 = isNorm ? by1 * imageSize.h : by1
        const x2 = isNorm ? bx2 * imageSize.w : bx2
        const y2 = isNorm ? by2 * imageSize.h : by2
        const color = CLASS_COLORS[grain.class_label] ?? DEFAULT_CLASS_COLOR
        const isSelected = selectedGrainId === grain.grain_id
        return (
          <g key={grain.grain_id}>
            <rect
              x={x1}
              y={y1}
              width={Math.max(1, x2 - x1)}
              height={Math.max(1, y2 - y1)}
              fill={isSelected ? color : 'transparent'}
              fillOpacity={isSelected ? 0.25 : 0}
              stroke={color}
              strokeWidth={isSelected ? 3 : 1.5}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onSelectGrain(isSelected ? null : grain.grain_id)
              }}
            />
          </g>
        )
      })}
    </svg>
  )
}
