export type DeviceStatus = 'active' | 'inactive' | 'maintenance'

export type FleetDevice = {
  id: string
  name: string
  status: DeviceStatus
  regionId: string
  regionName: string
  lastSeen: string | null
  createdAt: string
}
