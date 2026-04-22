import type { CapturedImage } from '../types/images.types'

type Props = {
  images: CapturedImage[]
  onSelect: (image: CapturedImage) => void
}

export function ImageListView({ images, onSelect }: Props) {
  return (
    <div className="p-4">
      <div className="rounded-md border border-border">
        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-4 border-b border-border bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground">
          <div className="w-10">Kind</div>
          <div>File name</div>
          <div>Device</div>
          <div>Captured</div>
          <div className="text-right">Size</div>
        </div>
        <div className="divide-y divide-border">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className="grid w-full grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-4 px-4 py-3 text-left text-sm transition hover:bg-muted/30"
              onClick={() => onSelect(image)}
            >
              <div className="w-10 text-xs font-medium uppercase text-muted-foreground">
                {image.kind}
              </div>
              <div className="font-medium text-foreground">
                {image.fileName}
              </div>
              <div className="text-muted-foreground">{image.deviceName}</div>
              <div className="whitespace-nowrap text-muted-foreground">
                {new Date(image.capturedAt).toLocaleString()}
              </div>
              <div className="whitespace-nowrap text-right text-muted-foreground">
                {image.sizeKb} KB
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
