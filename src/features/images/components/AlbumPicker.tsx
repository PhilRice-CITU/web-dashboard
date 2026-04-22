import { Badge } from '#/components/ui/badge'
import { AlbumCard } from './AlbumCard'

type Album = { id: string; name: string; count: number }
type AllAlbum = { count: number }

type Props = {
  all: AllAlbum
  byDevice: Album[]
  imagesError: unknown
  onSelectAll: () => void
  onSelectDevice: (id: string) => void
}

export function AlbumPicker({
  all,
  byDevice,
  imagesError,
  onSelectAll,
  onSelectDevice,
}: Props) {
  return (
    <div>
      <div className="space-y-1 border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Images</p>
        <p className="text-xs text-muted-foreground">
          Open All Images or a device folder to browse captured photos.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-4 xl:grid-cols-6">
        <AlbumCard title="All Images" count={all.count} onClick={onSelectAll} />
        {byDevice.map((album) => (
          <AlbumCard
            key={album.id}
            title={album.name}
            count={album.count}
            onClick={() => onSelectDevice(album.id)}
          />
        ))}
      </div>
      {imagesError ? (
        <div className="px-4 pb-4 text-sm text-rose-700">
          Failed to load images from API.
        </div>
      ) : null}
    </div>
  )
}
