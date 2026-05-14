import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '#/shared/lib/utils'

type Props = {
  images: string[]
  selectedIndex: number
  onSelect: (i: number) => void
  alt?: string
  onImageLoad?: (naturalWidth: number, naturalHeight: number) => void
  overlay?: React.ReactNode
  variantLabel?: string
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
  variantLabel,
}: Props) {
  const stripRef = useRef<HTMLDivElement>(null)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string>(images[selectedIndex])

  useEffect(() => {
    const next = images[selectedIndex]
    if (next === currentUrl) return
    setPrevUrl(currentUrl)
    setCurrentUrl(next)
    const t = window.setTimeout(() => setPrevUrl(null), 200)
    return () => window.clearTimeout(t)
  }, [images, selectedIndex, currentUrl])

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
      THUMBS_PER_SCROLL * (THUMB_SIZE + 8) * (direction === 'down' ? 1 : -1)
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
    <div className="flex gap-3 w-full">
      {showStrip && (
        <div
          className="flex flex-col items-center gap-1.5 shrink-0"
          style={{ width: THUMB_SIZE + 4 }}
        >
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => scrollStrip('up')}
            aria-label="Scroll thumbnails up"
          >
            <ChevronUp size={18} />
          </button>

          <div
            ref={stripRef}
            className="flex flex-col gap-2 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ maxHeight: 6 * (THUMB_SIZE + 8) }}
          >
            {images.map((url, i) => {
              const selected = i === selectedIndex
              return (
                <button
                  key={`${i}-${url}`}
                  type="button"
                  onClick={() => onSelect(i)}
                  className={cn(
                    'group shrink-0 overflow-hidden rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selected
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background opacity-100 scale-100'
                      : 'opacity-55 hover:opacity-100 hover:scale-105 ring-1 ring-border',
                  )}
                  style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                  aria-label={`Batch ${i + 1}`}
                  aria-current={selected}
                >
                  <img
                    src={url}
                    alt={`Batch ${i + 1} thumbnail`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => scrollStrip('down')}
            aria-label="Scroll thumbnails down"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${alt}, use arrow keys to navigate batches`}
        >
          {prevUrl && (
            <img
              key={`prev-${prevUrl}`}
              src={prevUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 block w-full opacity-0 transition-opacity duration-200"
            />
          )}
          <img
            key={`current-${currentUrl}`}
            src={currentUrl}
            alt={`${alt} batch ${selectedIndex + 1}`}
            className="block w-full opacity-0 transition-opacity duration-200 [&.loaded]:opacity-100"
            onLoad={(e) => {
              const img = e.currentTarget
              img.classList.add('loaded')
              onImageLoad?.(img.naturalWidth, img.naturalHeight)
            }}
          />
          {overlay}
          {showStrip && (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {variantLabel ? `${variantLabel} · ` : ''}Batch{' '}
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
