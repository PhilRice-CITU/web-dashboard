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
  cpu_percent: number | null
  memory_percent: number | null
  storage_percent: number | null
  temperature_celsius: number | null
  queue_depth: number | null
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
  quality_a: number
  quality_b: number
  quality_c: number
  quality_d: number
  avg_moisture: number | null
  avg_broken_grains: number | null
  avg_chalkiness: number | null
  avg_discoloration: number | null
}

export interface ApiAnalyticsTrendPoint {
  date: string
  total_grains: number
  total_samples: number
  quality_a: number
  quality_b: number
  quality_c: number
  quality_d: number
  avg_moisture: number
  avg_broken_grains: number
  avg_foreign_matter: number
  avg_chalkiness: number
  avg_discoloration: number
  avg_length_mm: number
  avg_quality_score: number
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

export interface ApiDashboardMoistureWatch {
  device_id: string
  device_name: string
  moisture: number
  delta: number
  severity: string
}

export interface ApiDashboardSummary {
  scans_processed_today: number
  online_devices: number
  total_devices: number
  avg_moisture: number | null
  avg_broken_grains: number | null
  grade_distribution: ApiDashboardGradeDistribution[]
  moisture_watch: ApiDashboardMoistureWatch[]
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
  bbox: [number, number, number, number]
  confidence?: number
  length_mm?: number | null
  width_mm?: number | null
  area_px?: number | null
  grain_size_class?: string
  ir_mean_intensity?: number | null
}

export interface ApiResultMetrics {
  qualityGrade?: 'A' | 'B' | 'C' | 'D'
  qualityScore?: number | null
  totalGrains?: number
  grainSizeClass?: string
  limitingFactor?: string
  brokenGrains?: number
  chalkinessPercentage?: number
  discolorationPercentage?: number
  foreignMatter?: number
  moistureContent?: number | null
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
  metrics: ApiResultMetrics
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

export type ResultImageVariant = 'raw' | 'ir' | 'annotated'

export interface ApiGrainEdit {
  grain_id: number
  to_class: string
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
  data: ApiCorrectionHistoryItem[]
  count: number
}
