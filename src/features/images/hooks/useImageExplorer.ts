import { useMemo, useState } from 'react'
import type { ApiDevice, ApiResultImagesListResponse } from '#/api/contracts'
import { useFetch } from '#/hooks/useApi'
import { mapApiImageToCapturedImage } from '../mappers/images.mappers'
import type {
  AlbumSelection,
  CapturedImage,
  ImageKind,
  SortOrder,
  ViewMode,
} from '../types/images.types'

const INITIAL_ALBUM_SELECTION: AlbumSelection = { type: 'albums' }

export type UseImageExplorerReturn = {
  devices: { id: string; name: string }[]
  capturedImages: CapturedImage[]
  albumSelection: AlbumSelection
  setAlbumSelection: (selection: AlbumSelection) => void
  kindFilter: 'all' | ImageKind
  setKindFilter: (filter: 'all' | ImageKind) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  groupByDevice: boolean
  setGroupByDevice: (group: boolean) => void
  searchText: string
  setSearchText: (text: string) => void
  selectedImage: CapturedImage | null
  setSelectedImage: (image: CapturedImage | null) => void
  albums: {
    all: { count: number }
    byDevice: { id: string; name: string; count: number }[]
  }
  filteredImages: CapturedImage[]
  groupedImages: {
    device: { id: string; name: string }
    images: CapturedImage[]
  }[]
  isAlbumPicker: boolean
  albumTitle: string
  canShowGrouped: boolean
  imagesError: unknown
  refetch: () => void
}

export function useImageExplorer(): UseImageExplorerReturn {
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
    if (!devicesResponse || devicesResponse.length === 0) return []
    return devicesResponse.map((device) => ({
      id: device.id,
      name: device.display_name,
    }))
  }, [devicesResponse])

  const capturedImages = useMemo<CapturedImage[]>(() => {
    if (!imagesResponse) return []
    return imagesResponse.data.map(mapApiImageToCapturedImage)
  }, [imagesResponse])

  const isAlbumPicker = albumSelection.type === 'albums'
  const albumTitle =
    albumSelection.type === 'all'
      ? 'All Images'
      : albumSelection.type === 'device'
        ? (devices.find((d) => d.id === albumSelection.deviceId)?.name ??
          'Device Images')
        : 'Albums'

  const albums = useMemo(() => {
    const byDevice = devices.map((device) => ({
      id: device.id,
      name: device.name,
      count: capturedImages.filter((img) => img.deviceId === device.id).length,
    }))
    return { all: { count: capturedImages.length }, byDevice }
  }, [capturedImages, devices])

  const filteredImages = useMemo<CapturedImage[]>(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    const scoped = capturedImages.filter((image) => {
      if (
        albumSelection.type === 'device' &&
        image.deviceId !== albumSelection.deviceId
      )
        return false
      if (kindFilter !== 'all' && image.kind !== kindFilter) return false
      if (normalizedSearch) {
        const haystack = [
          image.fileName,
          image.deviceName,
          image.deviceId,
          image.kind,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(normalizedSearch)) return false
      }
      return true
    })

    return [...scoped].sort((a, b) => {
      if (sortOrder === 'newest')
        return (
          new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
        )
      if (sortOrder === 'oldest')
        return (
          new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
        )
      if (sortOrder === 'name-asc') return a.fileName.localeCompare(b.fileName)
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
      .map((device) => ({ device, images: map.get(device.id) ?? [] }))
      .filter((entry) => entry.images.length > 0)
  }, [devices, filteredImages])

  const canShowGrouped = groupByDevice && viewMode !== 'list'

  return {
    devices,
    capturedImages,
    albumSelection,
    setAlbumSelection,
    kindFilter,
    setKindFilter,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    groupByDevice,
    setGroupByDevice,
    searchText,
    setSearchText,
    selectedImage,
    setSelectedImage,
    albums,
    filteredImages,
    groupedImages,
    isAlbumPicker,
    albumTitle,
    canShowGrouped,
    imagesError,
    refetch,
  }
}
