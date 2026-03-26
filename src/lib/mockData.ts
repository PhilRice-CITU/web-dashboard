/**
 * Mock Data for Dashboard
 * Simulates API responses for development
 */

import { computeRiceQualityScore } from '#/lib/scoring/riceQuality'
import type { GrainLengthClass } from '#/lib/scoring/riceQuality'

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
    label: 'Avg Grain Length',
    unit: 'mm',
    category: 'quality',
    allowedChartTypes: ['line', 'bar', 'area', 'composed'],
  },
  {
    key: 'avgQualityScore',
    label: 'Weighted Quality Score',
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

export interface Device {
  id: string
  name: string
  group?: string
  status: 'inactive' | 'scanning' | 'active'
  lastSeen: string
  samplesProcessed: number
  cpu: number
  latitude: number
  longitude: number
  location: string
}

// Mock devices
export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Main Lab - Analyzer 1',
    group: 'Lab',
    status: 'active',
    lastSeen: new Date().toISOString(),
    samplesProcessed: 156,
    cpu: 62,
    latitude: 15.6697118,
    longitude: 120.887031,
    location: 'Nueva Ecija',
  },
  {
    id: 'dev-002',
    name: 'Field Station - Analyzer 2',
    group: 'Field',
    status: 'scanning',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    samplesProcessed: 89,
    cpu: 48,
    latitude: 15.6675676,
    longitude: 120.8924649,
    location: 'Negros Occidental',
  },
  {
    id: 'dev-003',
    name: 'Storage Facility - Analyzer 3',
    group: 'Storage',
    status: 'inactive',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    samplesProcessed: 342,
    cpu: 9,
    latitude: 15.6696152,
    longitude: 120.8875163,
    location: 'Nueva Ecija',
  },
]

// Mock recent grain analysis results
type GrainResultSeed = {
  moisture: number
  broken: number
  foreignMatter: number
  chalkiness: number
  discoloration: number
  lengthClass: GrainLengthClass
  lengthMm: number
  grains: number
  deviceId: string
}

const grainResultSeeds: GrainResultSeed[] = [
  {
    moisture: 12.5,
    broken: 8,
    foreignMatter: 0.2,
    chalkiness: 4.8,
    discoloration: 1.3,
    lengthClass: 'long',
    lengthMm: 7.1,
    grains: 1250,
    deviceId: 'dev-001',
  },
  {
    moisture: 13.2,
    broken: 12,
    foreignMatter: 0.3,
    chalkiness: 6.2,
    discoloration: 1.8,
    lengthClass: 'medium',
    lengthMm: 6.5,
    grains: 1180,
    deviceId: 'dev-002',
  },
  {
    moisture: 14.8,
    broken: 35,
    foreignMatter: 0.5,
    chalkiness: 14.2,
    discoloration: 4.4,
    lengthClass: 'short',
    lengthMm: 5.7,
    grains: 950,
    deviceId: 'dev-001',
  },
  {
    moisture: 12.3,
    broken: 5,
    foreignMatter: 0.1,
    chalkiness: 3.2,
    discoloration: 0.7,
    lengthClass: 'very-long',
    lengthMm: 7.6,
    grains: 1100,
    deviceId: 'dev-002',
  },
  {
    moisture: 15.1,
    broken: 42,
    foreignMatter: 0.6,
    chalkiness: 18.9,
    discoloration: 6.1,
    lengthClass: 'medium',
    lengthMm: 6.3,
    grains: 1320,
    deviceId: 'dev-003',
  },
]

export const mockGrainResults: RiceGrainResult[] = grainResultSeeds.map(
  (seed, index) => {
    const score = computeRiceQualityScore({
      brokenGrainsPercentage: seed.broken,
      foreignMatterPercentage: seed.foreignMatter,
      chalkinessPercentage: seed.chalkiness,
      discolorationPercentage: seed.discoloration,
      moisturePercentage: seed.moisture,
      grainLengthClass: seed.lengthClass,
      grainLengthMm: seed.lengthMm,
    })

    return {
      id: `result-${String(index + 1).padStart(3, '0')}`,
      timestamp: new Date(
        Date.now() - (index * 35 + 10) * 60 * 1000,
      ).toISOString(),
      totalGrains: seed.grains,
      qualityGrade: score.grade,
      qualityScore: score.totalScore,
      moistureContent: seed.moisture,
      brokenGrains: seed.broken,
      foreignMatter: seed.foreignMatter,
      chalkinessPercentage: seed.chalkiness,
      discolorationPercentage: seed.discoloration,
      grainLengthClass: seed.lengthClass,
      grainLengthMm: seed.lengthMm,
      normalizedBrokenGrains: score.normalized.broken,
      normalizedForeignMatter: score.normalized.foreignMatter,
      normalizedChalkiness: score.normalized.chalkiness,
      normalizedDiscoloration: score.normalized.discoloration,
      normalizedLength: score.normalized.length,
      normalizedMoisture: score.normalized.moisture,
      status: 'analyzed',
      deviceId: seed.deviceId,
    }
  },
)

// Mock analytics data for charts
export const generateMockAnalyticsData = (): AnalyticsData[] => {
  const data: AnalyticsData[] = []
  const now = new Date()

  const toFixedNumber = (value: number, digits = 2) =>
    Number(value.toFixed(digits))

  const createWave = (seed: number, index: number, amplitude: number) =>
    Math.sin((index + seed) / 4) * amplitude +
    Math.cos((index + seed * 0.5) / 7) * (amplitude * 0.45)

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const index = 29 - i
    const totalSamples = Math.max(
      55,
      Math.round(118 + createWave(3, index, 16)),
    )
    const premiumShare = 0.42 + createWave(1, index, 0.03)
    const gradeBShare = 0.31 + createWave(2, index, 0.025)
    const gradeCShare = 0.18 + createWave(4, index, 0.015)

    const qualityA = Math.max(0, Math.round(totalSamples * premiumShare))
    const qualityB = Math.max(0, Math.round(totalSamples * gradeBShare))
    const qualityC = Math.max(0, Math.round(totalSamples * gradeCShare))
    const qualityD = Math.max(0, totalSamples - qualityA - qualityB - qualityC)

    const avgMoisture = toFixedNumber(13.1 + createWave(7, index, 0.58))
    const avgBrokenGrains = toFixedNumber(2.6 + createWave(5, index, 0.44))
    const avgForeignMatter = toFixedNumber(0.34 + createWave(6, index, 0.08))
    const avgChalkiness = toFixedNumber(6.4 + createWave(8, index, 1.15))
    const avgDiscoloration = toFixedNumber(1.8 + createWave(9, index, 0.3))
    const avgLengthMm = toFixedNumber(6.8 + createWave(10, index, 0.2))
    const avgQualityScore = toFixedNumber(79.5 + createWave(11, index, 5.4))
    const totalGrains = Math.round(
      totalSamples * (10.4 + createWave(12, index, 0.7)),
    )

    data.push({
      date: date.toISOString().split('T')[0],
      totalGrains,
      totalSamples,
      qualityA,
      qualityB,
      qualityC,
      qualityD,
      avgMoisture,
      avgBrokenGrains,
      avgForeignMatter,
      avgChalkiness,
      avgDiscoloration,
      avgLengthMm,
      avgQualityScore,
    })
  }

  return data
}

// Mock history data
export const mockHistory = mockGrainResults.slice(0, 10).map((result) => ({
  ...result,
  deviceName:
    mockDevices.find((d) => d.id === result.deviceId)?.name || 'Unknown',
}))

// Summary statistics
export const generateMockSummary = () => {
  const onlineDevices = mockDevices.filter(
    (device) => device.status === 'active' || device.status === 'scanning',
  ).length

  const analyzedResults = mockGrainResults.filter(
    (result) => result.status === 'analyzed',
  )

  const qualityACount = analyzedResults.filter(
    (result) => result.qualityGrade === 'A',
  ).length

  const totalSamples = analyzedResults.length

  const avgMoistureContent =
    analyzedResults.reduce(
      (total, result) => total + result.moistureContent,
      0,
    ) / Math.max(totalSamples, 1)

  const avgBrokenGrainPercentage =
    analyzedResults.reduce((total, result) => total + result.brokenGrains, 0) /
    Math.max(totalSamples, 1)

  return {
    totalSamples: 2847,
    qualityAPercentage: Math.round(
      (qualityACount / Math.max(totalSamples, 1)) * 100,
    ),
    onlineDevices,
    totalDevices: mockDevices.length,
    avgMoistureContent: Number(avgMoistureContent.toFixed(1)),
    avgBrokenGrainPercentage: Number(avgBrokenGrainPercentage.toFixed(1)),
  }
}
