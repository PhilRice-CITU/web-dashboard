import type { GrainLengthClass } from '#/shared/lib/scoring/riceQuality'

export interface RiceGrainResult {
  id: string
  timestamp: string
  totalGrains: number
  qualityGrade: 'A' | 'B' | 'C' | 'D'
  qualityScore: number
  moistureContent: number
  brokenGrains: number
  foreignMatter: number
  chalkinessPercentage: number
  discolorationPercentage: number
  grainLengthClass: GrainLengthClass
  grainLengthMm: number
  normalizedBrokenGrains: number
  normalizedForeignMatter: number
  normalizedChalkiness: number
  normalizedDiscoloration: number
  normalizedLength: number
  normalizedMoisture: number
  status: 'analyzed' | 'processing' | 'failed'
  deviceId: string
}

export interface AnalyticsData {
  date: string
  totalGrains: number
  totalSamples: number
  qualityA: number
  qualityB: number
  qualityC: number
  qualityD: number
  avgMoisture: number
  avgBrokenGrains: number
  avgForeignMatter: number
  avgChalkiness: number
  avgDiscoloration: number
  avgLengthMm: number
  avgQualityScore: number
}

export type AnalyticsChartType = 'line' | 'bar' | 'area' | 'pie' | 'composed'
export type AnalyticsAggregation = 'sum' | 'avg' | 'min' | 'max'
export type AnalyticsGranularity = 'daily' | 'weekly'
export type AnalyticsMetricKey =
  | 'totalGrains'
  | 'totalSamples'
  | 'qualityA'
  | 'qualityB'
  | 'qualityC'
  | 'qualityD'
  | 'avgMoisture'
  | 'avgBrokenGrains'
  | 'avgForeignMatter'
  | 'avgChalkiness'
  | 'avgDiscoloration'
  | 'avgLengthMm'
  | 'avgQualityScore'

export interface ChartBuilderConfig {
  id: string
  title: string
  chartType: AnalyticsChartType
  primaryMetric: AnalyticsMetricKey
  secondaryMetric?: AnalyticsMetricKey
  aggregation: AnalyticsAggregation
  granularity: AnalyticsGranularity
}

export interface AnalyticsPreset {
  id: string
  name: string
  createdAt: string
  schemaVersion: number
  charts: ChartBuilderConfig[]
}
