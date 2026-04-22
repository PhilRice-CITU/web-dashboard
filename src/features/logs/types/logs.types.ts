export type EventLevel = 'INFO' | 'WARN' | 'ERROR'

export interface LogEvent {
  time: string
  createdAt: number
  device: string
  level: EventLevel
  message: string
}
