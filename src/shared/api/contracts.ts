export interface ApiRegion {
  id: string
  name: string
  code: string
  created_at: string
  updated_at: string
}

export interface ApiDevice {
  id: string
  display_name: string
  status: 'active' | 'maintenance' | 'offline'
  region_id: string
  last_seen: string | null
  created_at: string
  updated_at: string
}

export interface ApiDeviceEvent {
  id: string
  device_id: string | null
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  meta: Record<string, unknown>
  created_at: string
}

export interface ApiDeviceEventsListResponse {
  data: ApiDeviceEvent[]
  count: number
}

export interface ApiAnalyticsSummary {
  total_samples: number
  grade_counts: Partial<Record<string, number>>
  factor_averages: Partial<Record<string, number | null>>
}

export interface ApiAnalyticsTrendPoint {
  date: string
  total_grains: number
  total_samples: number
  grade_counts: Partial<Record<string, number>>
  factor_averages: Partial<Record<string, number>>
  avg_length_mm: number
}

export interface ApiAnalyticsTrendsResponse {
  data: ApiAnalyticsTrendPoint[]
}

export interface ApiDashboardGradeDistribution {
  name: string
  value: number
  share: number
  status: string
}

export interface ApiDashboardSummary {
  scans_processed_today: number
  online_devices: number
  total_devices: number
  factor_averages_today: Record<string, number | null>
  grade_distribution: ApiDashboardGradeDistribution[]
}

export interface ApiResultImage {
  id: string
  result_id: string
  device_id: string
  device_name: string | null
  kind: string
  camera_type: string
  file_name: string
  storage_url: string
  signed_url: string | null
  captured_at: string
  created_at: string
}

export interface ApiResultImagesListResponse {
  data: ApiResultImage[]
  count: number
}

export interface ApiPerGrain {
  grain_id: number
  class_label: string
  visual_class?: string
  dimensional_class?: string
  bbox: [number, number, number, number] | null
  bbox_norm?: [number, number, number, number] | null
  confidence?: number
  source?: string
  normal_label?: string | null
  normal_confidence?: number | null
  ir_label?: string | null
  ir_confidence?: number | null
  fusion_reason?: string | null
  length_mm?: number | null
  width_mm?: number | null
  area_px?: number | null
  grain_size_class?: string
  batch_number?: number
}

export type PnsGradeName =
  | 'Premium'
  | 'Grade no. 1'
  | 'Grade no. 2'
  | 'Grade no. 3'
  | 'Grade no. 4'
  | 'Grade no. 5'
  | 'Off-Grade'

export interface ApiResultMetrics {
  qualityGrade?: PnsGradeName
  totalGrains?: number
  grainSizeClass?: string
  estimatedSizeClass?: string
  limitingFactor?: string
  brokenGrains?: number
  brewers?: number
  chalkinessPercentage?: number
  discolorationPercentage?: number
  damagedPercentage?: number
  redKernelPercentage?: number
  foreignCount?: number
  paddyCount?: number
  grainLengthMm?: number | null
  rawGrade?: string
  gradeOverridden?: boolean
  perGrain?: ApiPerGrain[]
  parameters?: Record<string, number>
}

export interface ApiResult {
  id: string
  device_id: string
  operator_name: string | null
  rice_variety: string | null
  metrics: ApiResultMetrics | null
  status: 'pending' | 'processing' | 'graded' | 'failed' | 'corrected' | null
  grading_error: string | null
  graded_at: string | null
  stub_mode: boolean | null
  created_at: string
  updated_at: string
}

export interface ApiResultImageSignedUrl {
  image_id: string
  signed_url: string
  expires_in: number
}

export type ResultImageVariant = 'raw' | 'ir' | 'annotated' | 'annotated_ir'

export interface ApiBatchImages {
  batch: number
  raw?: string | null
  ir?: string | null
  annotated?: string | null
  annotated_ir?: string | null
}

export interface ApiGrainEdit {
  grain_id: number
  to_class?: string | null
  to_visual_class?: string | null
  to_dimensional_class?: string | null
}

export interface ApiGrainCorrectionRequest {
  edits: ApiGrainEdit[]
}

export interface ApiGradeOverrideRequest {
  to_grade: string
  reason: string
}

export interface ApiCorrectionHistoryItem {
  id: string
  result_id: string
  corrected_by: string
  correction_type: 'grain_class' | 'grade_override'
  payload: Record<string, unknown>
  created_at: string
}

export interface ApiCorrectionHistoryResponse {
  data: ApiCorrectionHistoryItem[] | null
  count: number
}

export interface ApiResultsListResponse {
  data: ApiResult[]
  count: number
}
