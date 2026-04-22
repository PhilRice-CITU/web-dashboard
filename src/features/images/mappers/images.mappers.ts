import type { ApiResultImage } from '#/api/contracts'
import type { CapturedImage, ImageKind, ViewMode } from '../types/images.types'

export function mapApiImageToCapturedImage(
  image: ApiResultImage,
): CapturedImage {
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

export function getGridClass(viewMode: Exclude<ViewMode, 'list'>): string {
  if (viewMode === 'xl')
    return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
  if (viewMode === 'lg')
    return 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4'
  if (viewMode === 'md')
    return 'grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6'
  return 'grid grid-cols-3 gap-2 md:grid-cols-6 xl:grid-cols-8'
}

export function getPreviewHeightClass(
  viewMode: Exclude<ViewMode, 'list'>,
): string {
  if (viewMode === 'xl') return 'h-90'
  if (viewMode === 'lg') return 'h-60'
  if (viewMode === 'md') return 'h-50'
  return 'h-40'
}
