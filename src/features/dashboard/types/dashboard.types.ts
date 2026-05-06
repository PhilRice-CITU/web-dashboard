export type SignalLevel = 'ok' | 'warn' | 'info'

export type LiveSignal = {
  level: SignalLevel
  title: string
  detail: string
  timestamp: string
}

export type RiceGrade = {
  name: string
  value: string
  share: number
  status: 'positive' | 'negative'
}

export type MoistureEntry = {
  site: string
  moisture: string
  delta: string
  severity: 'ok' | 'warn'
}

export type DashboardSummary = {
  totalSamples: number
  onlineDevices: number
  totalDevices: number
  avgMoistureContent: number
  avgBrokenGrainPercentage: number
}

export type MapDevice = {
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
