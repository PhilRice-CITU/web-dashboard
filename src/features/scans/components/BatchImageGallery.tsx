import { useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Props = {
  images: string[]
  selectedIndex: number
  onSelect: (i: number) => void
  alt?: string
  onImageLoad?: (naturalWidth: number, naturalHeight: number) => void
  overlay?: React.ReactNode
}

const THUMB_SIZE = 72
const THUMBS_PER_SCROLL = 3

export function BatchImageGallery({
  images,
  selectedIndex,
  onSelect,
  alt = 'scan image',
  onImageLoad,
  overlay,
}: Props) {
  const stripRef = useRef<HTMLDivElement>(null)

  // Keep selected thumbnail visible when index changes externally.
  useEffect(() => {
    const el = stripRef.current?.children[selectedIndex] as
      | HTMLElement
      | undefined
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex])

  const scrollStrip = (direction: 'up' | 'down') => {
    const strip = stripRef.current
    if (!strip) return
    const delta =
      THUMBS_PER_SCROLL * (THUMB_SIZE + 4) * (direction === 'down' ? 1 : -1)
    strip.scrollBy({ top: delta, behavior: 'smooth' })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      onSelect(Math.max(0, selectedIndex - 1))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      onSelect(Math.min(images.length - 1, selectedIndex + 1))
    }
  }

  const showStrip = images.length > 1

  return (
    <div className="flex gap-2 w-full">
      {showStrip && (
        <div
          className="flex flex-col items-center gap-1 flex-shrink-0"
          style={{ width: THUMB_SIZE + 4 }}
        >
          <button
            type="button"
            className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => scrollStrip('up')}
            aria-label="Scroll thumbnails up"
          >
            <ChevronUp size={16} />
          </button>

          <div
            ref={stripRef}
            className="flex flex-col gap-1 overflow-y-auto"
            style={{ maxHeight: 6 * (THUMB_SIZE + 4), scrollbarWidth: 'none' }}
          >
            {images.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                className="flex-shrink-0 rounded overflow-hidden focus:outline-none"
                style={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  border:
                    i === selectedIndex
                      ? '2px solid hsl(var(--primary))'
                      : '2px solid transparent',
                  opacity: i === selectedIndex ? 1 : 0.55,
                  transition: 'border-color 0.15s, opacity 0.15s',
                }}
                aria-label={`Batch ${i + 1}`}
                aria-current={i === selectedIndex}
              >
                <img
                  src={url}
                  alt={`Batch ${i + 1} thumbnail`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => scrollStrip('down')}
            aria-label="Scroll thumbnails down"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <div
          className="relative w-full overflow-hidden rounded-lg border border-border bg-black focus:outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${alt}, use arrow keys to navigate batches`}
        >
          <img
            src={images[selectedIndex]}
            alt={`${alt} batch ${selectedIndex + 1}`}
            className="block w-full"
            onLoad={(e) => {
              const img = e.currentTarget
              onImageLoad?.(img.naturalWidth, img.naturalHeight)
            }}
          />
          {overlay}
        </div>

        {showStrip && (
          <p className="text-xs text-muted-foreground text-right pr-1">
            Batch {selectedIndex + 1} of {images.length}
          </p>
        )}
      </div>
    </div>
  )
}
