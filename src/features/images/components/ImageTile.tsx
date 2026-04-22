import { Badge } from '#/components/ui/badge'
import { getPreviewHeightClass } from '../mappers/images.mappers'
import type { CapturedImage, ViewMode } from '../types/images.types'

type Props = {
  image: CapturedImage
  viewMode: Exclude<ViewMode, 'list'>
  onClick: () => void
}

export function ImageTile({ image, viewMode, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-md border border-border bg-muted/20 text-left transition ${getPreviewHeightClass(viewMode)}`}
    >
      <img
        src={image.imageUrl}
        alt={image.fileName}
        className="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
        loading="lazy"
      />
      {viewMode !== 'sm' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <p className="truncate text-xs font-medium">{image.fileName}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] text-zinc-300">
                {new Date(image.capturedAt).toLocaleTimeString()}
              </p>
              <Badge
                variant="outline"
                className="h-4 border-zinc-600 bg-zinc-900/80 px-1 text-[9px] uppercase text-zinc-300"
              >
                {image.kind}
              </Badge>
            </div>
          </div>
        </>
      )}
    </button>
  )
}
