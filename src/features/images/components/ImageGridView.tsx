import { getGridClass } from '../mappers/images.mappers'
import { ImageTile } from './ImageTile'
import type { CapturedImage, ViewMode } from '../types/images.types'

type Props = {
  viewMode: Exclude<ViewMode, 'list'>
  canShowGrouped: boolean
  filteredImages: CapturedImage[]
  groupedImages: {
    device: { id: string; name: string }
    images: CapturedImage[]
  }[]
  onSelect: (image: CapturedImage) => void
}

export function ImageGridView({
  viewMode,
  canShowGrouped,
  filteredImages,
  groupedImages,
  onSelect,
}: Props) {
  const gridClass = getGridClass(viewMode)

  return (
    <div className="p-4 space-y-8">
      {canShowGrouped ? (
        groupedImages.map((group) => (
          <div key={group.device.id} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <h3 className="text-base font-semibold">{group.device.name}</h3>
              <p className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border">
                {group.images.length} images
              </p>
            </div>
            {group.images.length > 0 ? (
              <div className={gridClass}>
                {group.images.map((image) => (
                  <ImageTile
                    key={image.id}
                    image={image}
                    viewMode={viewMode}
                    onClick={() => onSelect(image)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                No images match your search for this device.
              </p>
            )}
          </div>
        ))
      ) : (
        <div className={gridClass}>
          {filteredImages.map((image) => (
            <ImageTile
              key={image.id}
              image={image}
              viewMode={viewMode}
              onClick={() => onSelect(image)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
