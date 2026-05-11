export interface AnalyticsData {
  date: string
  totalGrains: number
  totalSamples: number
  gradePremium: number
  grade1: number
  grade2: number
  grade3: number
  grade4: number
  grade5: number
  gradeOffGrade: number
  avgBrokenGrains: number
  avgBrewers: number
  avgChalkiness: number
  avgDiscoloration: number
  avgDamaged: number
  avgRed: number
  avgLengthMm: number
}

export type AnalyticsChartType = 'line' | 'bar' | 'area' | 'pie' | 'composed'
export type AnalyticsAggregation = 'sum' | 'avg' | 'min' | 'max'
export type AnalyticsGranularity = 'daily' | 'weekly'
export type AnalyticsMetricKey =
  | 'totalGrains'
  | 'totalSamples'
  | 'gradePremium'
  | 'grade1'
  | 'grade2'
  | 'grade3'
  | 'grade4'
  | 'grade5'
  | 'gradeOffGrade'
  | 'avgBrokenGrains'
  | 'avgBrewers'
  | 'avgChalkiness'
  | 'avgDiscoloration'
  | 'avgDamaged'
  | 'avgRed'
  | 'avgLengthMm'

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
