export type ViewMode = 'xl' | 'lg' | 'md' | 'sm' | 'list'
export type ImageKind = 'raw' | 'ir' | 'processed'
export type AlbumSelection =
  | { type: 'albums' }
  | { type: 'all' }
  | { type: 'device'; deviceId: string }
export type SortOrder = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

export type CapturedImage = {
  id: string
  resultId: string
  fileName: string
  imageUrl: string
  deviceId: string
  deviceName: string
  kind: ImageKind
  capturedAt: string
  sizeKb: number
}
