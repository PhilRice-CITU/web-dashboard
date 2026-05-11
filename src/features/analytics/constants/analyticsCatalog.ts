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
    key: 'gradePremium',
    label: 'Premium',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'grade1',
    label: 'Grade 1',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'grade2',
    label: 'Grade 2',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'grade3',
    label: 'Grade 3',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'grade4',
    label: 'Grade 4',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'grade5',
    label: 'Grade 5',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'gradeOffGrade',
    label: 'Off-Grade',
    unit: 'samples',
    category: 'grade',
    allowedChartTypes: ['line', 'bar', 'area', 'composed', 'pie'],
  },
  {
    key: 'avgBrokenGrains',
    label: 'Avg Broken Grains',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgBrewers',
    label: 'Avg Brewers',
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
    key: 'avgDamaged',
    label: 'Avg Damaged',
    unit: '%',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgRed',
    label: 'Avg Red Kernels',
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
