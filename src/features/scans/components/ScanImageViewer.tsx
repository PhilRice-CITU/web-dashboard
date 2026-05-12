import { useEffect, useRef, useState } from 'react'

import { useScanImage } from '#/features/scans/hooks/useScanDetail'
import { CLASS_COLORS, DEFAULT_CLASS_COLOR } from '#/features/scans/types'
import type { ApiPerGrain, ResultImageVariant } from '#/shared/api/contracts'
import { Button } from '#/shared/components/ui/button'

type Props = {
  resultId: string
  perGrain: ApiPerGrain[]
  selectedGrainId: number | null
  onSelectGrain: (grainId: number | null) => void
}

const TABS: ResultImageVariant[] = ['raw', 'ir', 'annotated', 'annotated_ir']

export function ScanImageViewer({
  resultId,
  perGrain,
  selectedGrainId,
  onSelectGrain,
}: Props) {
  const [variant, setVariant] = useState<ResultImageVariant>('annotated')
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(
    null,
  )

  const { data: image, isLoading, error } = useScanImage(resultId, variant)

  useEffect(() => {
    setImageSize(null)
  }, [image?.signed_url])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab}
            type="button"
            size="sm"
            variant={variant === tab ? 'default' : 'outline'}
            onClick={() => {
              setVariant(tab)
              if (tab !== 'annotated' && tab !== 'annotated_ir')
                onSelectGrain(null)
            }}
          >
            {tab === 'raw'
              ? 'Raw'
              : tab === 'ir'
                ? 'IR'
                : tab === 'annotated'
                  ? 'Annotated'
                  : 'Annotated IR'}
          </Button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg border border-border bg-black"
      >
        {isLoading && (
          <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
            Loading image…
          </div>
        )}
        {error && (
          <div className="flex h-96 items-center justify-center px-6 text-center text-sm text-destructive">
            Image not available yet.
          </div>
        )}
        {image && (
          <img
            src={image.signed_url}
            alt={`${variant} scan`}
            className="block w-full"
            onLoad={(e) => {
              const img = e.currentTarget
              setImageSize({
                w: img.naturalWidth,
                h: img.naturalHeight,
              })
            }}
          />
        )}
        {(variant === 'annotated' || variant === 'annotated_ir') &&
          imageSize && (
            <BBoxOverlay
              perGrain={perGrain}
              imageSize={imageSize}
              selectedGrainId={selectedGrainId}
              onSelectGrain={onSelectGrain}
            />
          )}
      </div>
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
