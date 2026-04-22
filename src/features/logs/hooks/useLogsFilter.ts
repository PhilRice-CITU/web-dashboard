import { useMemo, useState } from 'react'
import type { LogEvent } from '../types/logs.types'

export type UseLogsFilterReturn = {
  search: string
  setSearch: (query: string) => void
  viewMode: 'list' | 'grid'
  setViewMode: (mode: 'list' | 'grid') => void
  expandedTerminalDevice: string | null
  setExpandedTerminalDevice: (device: string | null) => void
  filteredEvents: LogEvent[]
  deviceGroups: { device: string; events: LogEvent[] }[]
}

export function useLogsFilter(liveEvents: LogEvent[]): UseLogsFilterReturn {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [expandedTerminalDevice, setExpandedTerminalDevice] = useState<
    string | null
  >(null)

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return liveEvents
    return liveEvents.filter((event) =>
      `${event.device} ${event.level} ${event.message} ${event.time}`
        .toLowerCase()
        .includes(query),
    )
  }, [liveEvents, search])

  const deviceGroups = useMemo(() => {
    const grouped = filteredEvents.reduce<Record<string, LogEvent[]>>(
      (acc, event) => {
        acc[event.device] ??= []
        acc[event.device].push(event)
        return acc
      },
      {},
    )
    return Object.entries(grouped).map(([device, events]) => ({
      device,
      events,
    }))
  }, [filteredEvents])

  return {
    search,
    setSearch,
    viewMode,
    setViewMode,
    expandedTerminalDevice,
    setExpandedTerminalDevice,
    filteredEvents,
    deviceGroups,
  }
}
