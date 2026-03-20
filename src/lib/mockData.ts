/**
 * Mock Data for Dashboard
 * Simulates API responses for development
 */

export interface RiceGrainResult {
  id: string
  timestamp: string
  totalGrains: number
  qualityGrade: 'A' | 'B' | 'C' | 'D'
  moistureContent: number
  brokenGrains: number
  foreignMatter: number
  status: 'analyzed' | 'processing' | 'failed'
  deviceId: string
}

export interface AnalyticsData {
  date: string
  totalGrains: number
  qualityA: number
  qualityB: number
  qualityC: number
  qualityD: number
  avgMoisture: number
}

export interface Device {
  id: string
  name: string
  group?: string
  status: 'online' | 'offline'
  lastSeen: string
  samplesProcessed: number
}

// Mock devices
export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Main Lab - Analyzer 1',
    group: 'Lab',
    status: 'online',
    lastSeen: new Date().toISOString(),
    samplesProcessed: 156,
  },
  {
    id: 'dev-002',
    name: 'Field Station - Analyzer 2',
    group: 'Field',
    status: 'online',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    samplesProcessed: 89,
  },
  {
    id: 'dev-003',
    name: 'Storage Facility - Analyzer 3',
    group: 'Storage',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    samplesProcessed: 342,
  },
]

// Mock recent grain analysis results
export const mockGrainResults: RiceGrainResult[] = [
  {
    id: 'result-001',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    totalGrains: 1250,
    qualityGrade: 'A',
    moistureContent: 12.5,
    brokenGrains: 8,
    foreignMatter: 0.2,
    status: 'analyzed',
    deviceId: 'dev-001',
  },
  {
    id: 'result-002',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    totalGrains: 1180,
    qualityGrade: 'A',
    moistureContent: 13.2,
    brokenGrains: 12,
    foreignMatter: 0.3,
    status: 'analyzed',
    deviceId: 'dev-002',
  },
  {
    id: 'result-003',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    totalGrains: 950,
    qualityGrade: 'B',
    moistureContent: 14.8,
    brokenGrains: 35,
    foreignMatter: 0.5,
    status: 'analyzed',
    deviceId: 'dev-001',
  },
  {
    id: 'result-004',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    totalGrains: 1100,
    qualityGrade: 'A',
    moistureContent: 12.3,
    brokenGrains: 5,
    foreignMatter: 0.1,
    status: 'analyzed',
    deviceId: 'dev-002',
  },
  {
    id: 'result-005',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    totalGrains: 1320,
    qualityGrade: 'B',
    moistureContent: 15.1,
    brokenGrains: 42,
    foreignMatter: 0.6,
    status: 'analyzed',
    deviceId: 'dev-001',
  },
]

// Mock analytics data for charts
export const generateMockAnalyticsData = (): AnalyticsData[] => {
  const data: AnalyticsData[] = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0],
      totalGrains: Math.floor(Math.random() * 500) + 1000,
      qualityA: Math.floor(Math.random() * 300) + 400,
      qualityB: Math.floor(Math.random() * 200) + 200,
      qualityC: Math.floor(Math.random() * 100) + 50,
      qualityD: Math.floor(Math.random() * 50) + 10,
      avgMoisture: Math.random() * 4 + 11,
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
  return {
    totalSamples: 2847,
    qualityAPercentage: 68,
    onlineDevices: 2,
    totalDevices: 3,
    avgMoistureContent: 13.2,
    avgBrokenGrainPercentage: 2.8,
  }
}
