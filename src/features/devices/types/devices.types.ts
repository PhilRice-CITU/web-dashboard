export type DeviceAction =
  | 'capture'
  | 'restart-app'
  | 'restart-device'
  | 'shutdown-device'
  | 'view-device'

export type FleetDevice = {
  id: string
  name: string
  group?: string
  status: 'inactive' | 'scanning' | 'active'
  lastSeen: string
  samplesProcessed: number | null
  cpuPercent: number | null
  memoryPercent: number | null
  storagePercent: number | null
  temperatureCelsius: number | null
  queueDepth: number | null
  latitude: number
  longitude: number
  location: string
}

export type DeviceTelemetry = {
  cpuPercent: number | null
  memoryPercent: number | null
  storagePercent: number | null
  temperatureCelsius: number | null
  queueDepth: number | null
  cameraStatus: string
  networkLatencyMs: number | null
}
