import type {
  AnalyticsAggregation,
  AnalyticsChartType,
  AnalyticsGranularity,
  AnalyticsMetricKey,
} from '#/features/analytics/types/analytics.types'

export interface AnalyticsMetricDefinition {
  key: AnalyticsMetricKey
  label: string
  unit: string
  category: 'volume' | 'grade' | 'quality'
  allowedChartTypes: AnalyticsChartType[]
}

export const analyticsMetricCatalog: AnalyticsMetricDefinition[] = [
  {
    key: 'totalGrains',
    label: 'Total Grains',
    unit: 'grains',
    category: 'volume',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'totalSamples',
    label: 'Total Samples',
    unit: 'samples',
    category: 'volume',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'qualityA',
    label: 'Grade A',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'qualityB',
    label: 'Grade B',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'qualityC',
    label: 'Grade C',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'qualityD',
    label: 'Grade D',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'avgMoisture',
    label: 'Avg Moisture',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgBrokenGrains',
    label: 'Avg Broken Grains',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgForeignMatter',
    label: 'Avg Foreign Matter',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgChalkiness',
    label: 'Avg Chalkiness',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgDiscoloration',
    label: 'Avg Discoloration',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgLengthMm',
    label: 'Avg Length',
    unit: 'mm',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgQualityScore',
    label: 'Avg Quality Score',
    unit: 'score',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
]

export const analyticsChartTypes: {
  value: AnalyticsChartType
  label: string
}[] = [
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
  { value: 'area', label: 'Area' },
  { value: 'pie', label: 'Pie' },
  { value: 'composed', label: 'Composed' },
]

export const analyticsAggregationOptions: {
  value: AnalyticsAggregation
  label: string
}[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
]

export const analyticsGranularityOptions: {
  value: AnalyticsGranularity
  label: string
}[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
]
