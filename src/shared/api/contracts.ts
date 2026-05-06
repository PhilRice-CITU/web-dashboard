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

export interface ApiDeviceCommand {
  id: string
  device_id: string
  command: string
  args: Record<string, unknown>
  status: string
  created_at: string
  processed_at: string | null
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
