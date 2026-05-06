import { Badge } from '#/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/shared/components/ui/dialog'
import { Separator } from '#/shared/components/ui/separator'
import type { CapturedImage } from '../types/images.types'

type Props = {
  image: CapturedImage | null
  onClose: () => void
}

export function ImageDetailDialog({ image, onClose }: Props) {
  return (
    <Dialog open={Boolean(image)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
          <DialogTitle>{image?.fileName}</DialogTitle>
          <DialogDescription>
            High-resolution view and metadata
          </DialogDescription>
        </DialogHeader>
        {image && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] max-h-[80vh]">
            <div className="bg-black/5 flex items-center justify-center p-4 min-h-[300px]">
              <img
                src={image.imageUrl}
                alt={image.fileName}
                className="max-h-full max-w-full rounded border border-border object-contain shadow-sm"
              />
            </div>
            <div className="border-l border-border bg-background p-5 overflow-y-auto">
              <h3 className="text-sm font-semibold mb-4">Image Metadata</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID</p>
                  <p className="font-mono text-xs">{image.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Source Device
                  </p>
                  <p className="font-medium">{image.deviceName}</p>
                  <p className="text-xs text-muted-foreground">
                    {image.deviceId}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Timestamp
                  </p>
                  <p>{new Date(image.capturedAt).toLocaleString()}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Classification
                  </p>
                  <Badge variant="outline" className="uppercase mt-1 w-fit">
                    {image.kind}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Size</p>
                  <p>{image.sizeKb} KB</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
