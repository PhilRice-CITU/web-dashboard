import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpDown,
  FolderIcon,
  Grid2x2,
  ImagesIcon,
  RefreshCcw,
  Search,
} from 'lucide-react'

import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import type {
  ApiDevice,
  ApiResultImage,
  ApiResultImagesListResponse,
} from '#/shared/api/contracts'
import { Badge } from '#/shared/components/ui/badge'
import { Button } from '#/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import { Input } from '#/shared/components/ui/input'
import { useFetch } from '#/shared/hooks/useApi'

type ViewMode = 'xl' | 'lg' | 'md' | 'sm' | 'list'
type ImageKind = 'raw' | 'ir' | 'processed'
type AlbumSelection =
  | { type: 'albums' }
  | { type: 'all' }
  | { type: 'device'; deviceId: string }

type CapturedImage = {
  id: string
  fileName: string
  imageUrl: string
  deviceId: string
  deviceName: string
  kind: ImageKind
  capturedAt: string
  sizeKb: number
}

type SortOrder = 'newest' | 'oldest' | 'name-asc' | 'name-desc'
const INITIAL_ALBUM_SELECTION: AlbumSelection = { type: 'albums' }

export function ImageExplorerPage() {
  const { data: devicesResponse } = useFetch<ApiDevice[]>({
    url: '/devices',
    retry: false,
    refetchInterval: 30_000,
  })

  const {
    data: imagesResponse,
    error: imagesError,
    refetch,
  } = useFetch<ApiResultImagesListResponse>({
    url: '/results/images?page=1&page_size=500&include_signed_url=true',
    retry: false,
    refetchInterval: 30_000,
  })

  const [albumSelection, setAlbumSelection] = useState<AlbumSelection>(
    INITIAL_ALBUM_SELECTION,
  )
  const [kindFilter, setKindFilter] = useState<'all' | ImageKind>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('md')
  const [groupByDevice, setGroupByDevice] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null)

  const devices = useMemo(() => {
    if (!devicesResponse || devicesResponse.length === 0) {
      return []
    }

    return devicesResponse.map((device) => ({
      id: device.id,
      name: device.display_name,
    }))
  }, [devicesResponse])

  const capturedImages = useMemo(() => {
    if (!imagesResponse) {
      return []
    }

    return imagesResponse.data.map(mapApiImageToCapturedImage)
  }, [imagesResponse])

  const isAlbumPicker = albumSelection.type === 'albums'
  const albumTitle =
    albumSelection.type === 'all'
      ? 'All Images'
      : albumSelection.type === 'device'
        ? (devices.find((device) => device.id === albumSelection.deviceId)
            ?.name ?? 'Device Images')
        : 'Albums'

  const albums = useMemo(() => {
    const byDevice = devices.map((device) => {
      const images = capturedImages.filter(
        (image) => image.deviceId === device.id,
      )

      return {
        id: device.id,
        name: device.name,
        count: images.length,
      }
    })

    return {
      all: {
        count: capturedImages.length,
      },
      byDevice,
    }
  }, [capturedImages, devices])

  const filteredImages = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    const scoped = capturedImages.filter((image) => {
      if (
        albumSelection.type === 'device' &&
        image.deviceId !== albumSelection.deviceId
      ) {
        return false
      }

      if (kindFilter !== 'all' && image.kind !== kindFilter) {
        return false
      }

      if (normalizedSearch) {
        const haystack = [
          image.fileName,
          image.deviceName,
          image.deviceId,
          image.kind,
        ]
          .join(' ')
          .toLowerCase()

        if (!haystack.includes(normalizedSearch)) {
          return false
        }
      }

      return true
    })

    return [...scoped].sort((a, b) => {
      if (sortOrder === 'newest') {
        return (
          new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
        )
      }

      if (sortOrder === 'oldest') {
        return (
          new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
        )
      }

      if (sortOrder === 'name-asc') {
        return a.fileName.localeCompare(b.fileName)
      }

      return b.fileName.localeCompare(a.fileName)
    })
  }, [albumSelection, capturedImages, kindFilter, searchText, sortOrder])

  const groupedImages = useMemo(() => {
    const map = new Map<string, CapturedImage[]>()

    for (const image of filteredImages) {
      const bucket = map.get(image.deviceId)

      if (bucket) {
        bucket.push(image)
      } else {
        map.set(image.deviceId, [image])
      }
    }

    return devices
      .map((device) => ({
        device,
        images: map.get(device.id) ?? [],
      }))
      .filter((entry) => entry.images.length > 0)
  }, [devices, filteredImages])

  const canShowGrouped = groupByDevice && viewMode !== 'list'

  return (
    <PlatformShell
      title="Captured Images"
      description="Browse captured edge images across devices and camera modes."
      actions={
        <Button
          variant="ghost"
          size="sm"
          className="h-9"
          onClick={() => refetch()}
        >
          <RefreshCcw className="mr-2 size-4" />
          Refresh
        </Button>
      }
    >
      <section className="space-y-0">
        {isAlbumPicker ? (
          <div>
            <div className="space-y-1 border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Images</p>
              <p className="text-xs text-muted-foreground">
                Open All Images or a device folder to browse captured photos.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-4 xl:grid-cols-6">
              <AlbumCard
                title="All Images"
                count={albums.all.count}
                onClick={() => {
                  setAlbumSelection({ type: 'all' })
                  setGroupByDevice(true)
                }}
              />
              {albums.byDevice.map((album) => (
                <AlbumCard
                  key={album.id}
                  title={album.name}
                  count={album.count}
                  onClick={() => {
                    setAlbumSelection({ type: 'device', deviceId: album.id })
                    setGroupByDevice(false)
                  }}
                />
              ))}
            </div>
            {imagesError ? (
              <div className="px-4 pb-4 text-sm text-rose-700">
                Failed to load images from API.
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9"
                onClick={() => {
                  setAlbumSelection({ type: 'albums' })
                  setSelectedImage(null)
                }}
              >
                <ArrowLeft className="mr-2 size-4" />
                Folders
              </Button>

              <div className="relative max-w-lg flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search file name, device, kind"
                  className="h-9 pl-8"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" className="h-9" />}
                >
                  <ArrowUpDown className="mr-2 size-4" />
                  Sort
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72">
                  <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                    Sort order
                  </p>
                  <DropdownMenuRadioGroup
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as SortOrder)}
                  >
                    <DropdownMenuRadioItem value="newest">
                      Newest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">
                      Oldest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name-asc">
                      Name A-Z
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name-desc">
                      Name Z-A
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>

                  <DropdownMenuSeparator />
                  <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                    Image kind
                  </p>
                  <DropdownMenuRadioGroup
                    value={kindFilter}
                    onValueChange={(value) =>
                      setKindFilter(value as 'all' | ImageKind)
                    }
                  >
                    <DropdownMenuRadioItem value="all">
                      All kinds
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="raw">
                      Raw
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ir">IR</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="processed">
                      Processed
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" className="h-9" />}
                >
                  <Grid2x2 className="mr-2 size-4" />
                  View
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                    Icon size / layout
                  </p>
                  <DropdownMenuRadioGroup
                    value={viewMode}
                    onValueChange={(value) => setViewMode(value as ViewMode)}
                  >
                    <DropdownMenuRadioItem value="xl">
                      Extra large icons
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="lg">
                      Large icons
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="md">
                      Medium icons
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="sm">
                      Small icons
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="list">
                      List
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={groupByDevice}
                    onCheckedChange={(checked) =>
                      setGroupByDevice(Boolean(checked))
                    }
                  >
                    Group by device
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Badge variant="outline" className="h-8 px-3">
                {albumTitle}
              </Badge>
              <Badge variant="outline" className="h-8 px-3">
                {filteredImages.length} images
              </Badge>
            </div>

            {filteredImages.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No captured images match the current filters.
              </div>
            ) : viewMode === 'list' ? (
              <div className="divide-y divide-border">
                <div className="grid grid-cols-[2.4fr_1fr_1fr_1fr] gap-2 bg-muted/40 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <span>Name</span>
                  <span>Device</span>
                  <span>Kind</span>
                  <span className="text-right">Captured</span>
                </div>
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="grid grid-cols-[2.4fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <ImagesIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-medium">
                        {image.fileName}
                      </span>
                    </div>
                    <span className="truncate text-muted-foreground">
                      {image.deviceName}
                    </span>
                    <span className="uppercase">{image.kind}</span>
                    <span className="text-right text-muted-foreground">
                      {new Date(image.capturedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : canShowGrouped ? (
              <div className="space-y-0">
                {groupedImages.map((group) => (
                  <div
                    key={group.device.id}
                    className="border-b border-border px-4 py-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="size-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">
                          {group.device.name}
                        </h2>
                      </div>
                      <Badge variant="outline">
                        {group.images.length} images
                      </Badge>
                    </div>

                    <div className={getGridClass(viewMode)}>
                      {group.images.map((image) => (
                        <ImageTile
                          key={image.id}
                          image={image}
                          viewMode={viewMode}
                          onOpen={setSelectedImage}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-4">
                <div className={getGridClass(viewMode)}>
                  {filteredImages.map((image) => (
                    <ImageTile
                      key={image.id}
                      image={image}
                      viewMode={viewMode}
                      onOpen={setSelectedImage}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Dialog
          open={Boolean(selectedImage)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedImage(null)
            }
          }}
        >
          <DialogContent className="max-w-4xl p-0">
            {selectedImage ? (
              <>
                <DialogHeader className="border-b border-border">
                  <DialogTitle>{selectedImage.fileName}</DialogTitle>
                  <DialogDescription>
                    {selectedImage.deviceName} ({selectedImage.deviceId})
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-[1.7fr_1fr]">
                  <div className="rounded-xl bg-muted/30 p-4">
                    <img
                      src={selectedImage.imageUrl}
                      alt={selectedImage.fileName}
                      className="h-105 w-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 p-4 border-l border-border">
                    <DetailRow
                      label="File name"
                      value={selectedImage.fileName}
                    />
                    <DetailRow
                      label="Device"
                      value={selectedImage.deviceName}
                    />
                    <DetailRow
                      label="Device ID"
                      value={selectedImage.deviceId}
                    />
                    <DetailRow
                      label="Kind"
                      value={selectedImage.kind.toUpperCase()}
                    />
                    <DetailRow
                      label="Captured"
                      value={new Date(
                        selectedImage.capturedAt,
                      ).toLocaleString()}
                    />
                    <DetailRow
                      label="Size"
                      value={`${(selectedImage.sizeKb / 1024).toFixed(2)} MB`}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </section>
    </PlatformShell>
  )
}

function ImageTile({
  image,
  viewMode,
  onOpen,
}: {
  image: CapturedImage
  viewMode: Exclude<ViewMode, 'list'>
  onOpen: (image: CapturedImage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      className="group w-full text-left transition"
    >
      <article className="overflow-hidden rounded-lg bg-card border border-border transition duration-200 group-hover:brightness-85">
        <div
          className={`relative ${getPreviewHeightClass(viewMode)} bg-linear-to-br p-1`}
        >
          <img
            src={image.imageUrl}
            alt={image.fileName}
            loading="lazy"
            className="h-full w-full rounded-md object-cover shadow-md"
          />
        </div>

        <div className="space-y-1 px-3 py-2">
          <p className="truncate text-sm font-medium">{image.fileName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {image.deviceName}
          </p>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{(image.sizeKb / 1024).toFixed(2)} MB</span>
            <span>{new Date(image.capturedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </article>
    </button>
  )
}

function AlbumCard({
  title,
  count,
  onClick,
}: {
  title: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left transition hover:-translate-y-0.5"
    >
      <article className="relative h-40 pt-4">
        <div className="absolute left-0 top-4 bg-gray-50 h-5 w-[calc(100%-2rem)] rounded-t-lg border border-border border-b-none" />
        <div className="absolute inset-x-0 top-6 bottom-0 rounded-xl  border border-border bg-card p-4 shadow-sm transition group-hover:border-primary/40 group-hover:shadow-md">
          <div className="flex h-full flex-col justify-between">
            <Badge variant="outline" className="w-fit bg-background/80">
              Folder
            </Badge>
            <div className="space-y-1">
              <p className="truncate text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{count} images</p>
            </div>
          </div>
        </div>
      </article>
    </button>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground wrap-break-word">
        {value}
      </p>
    </div>
  )
}

function getGridClass(viewMode: Exclude<ViewMode, 'list'>) {
  if (viewMode === 'xl') {
    return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
  }

  if (viewMode === 'lg') {
    return 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4'
  }

  if (viewMode === 'md') {
    return 'grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6'
  }

  return 'grid grid-cols-3 gap-2 md:grid-cols-6 xl:grid-cols-8'
}

function getPreviewHeightClass(viewMode: Exclude<ViewMode, 'list'>) {
  if (viewMode === 'xl') {
    return 'h-90'
  }

  if (viewMode === 'lg') {
    return 'h-60'
  }

  if (viewMode === 'md') {
    return 'h-50'
  }

  return 'h-40'
}

function mapApiImageToCapturedImage(image: ApiResultImage): CapturedImage {
  const normalizedKind = image.kind.toLowerCase()
  const kind: ImageKind =
    normalizedKind === 'raw'
      ? 'raw'
      : normalizedKind === 'ir'
        ? 'ir'
        : 'processed'

  return {
    id: image.id,
    fileName: image.file_name,
    imageUrl: image.signed_url ?? image.storage_url,
    deviceId: image.device_id,
    deviceName: image.device_name ?? image.device_id,
    kind,
    capturedAt: image.captured_at,
    sizeKb: 512,
  }
}
