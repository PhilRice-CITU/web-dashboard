import { useMemo, useState } from 'react'

export type UseAnalyticsFiltersReturn = {
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  stationFilter: string
  setStationFilter: (v: string) => void
  gradeFilter: string
  setGradeFilter: (v: string) => void
  trendsUrl: string
}

export function useAnalyticsFilters(): UseAnalyticsFiltersReturn {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [stationFilter, setStationFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')

  const trendsUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (startDate) params.set('start_date', startDate)
    if (endDate) params.set('end_date', endDate)
    if (stationFilter.trim().length > 0)
      params.set('device_id', stationFilter.trim())
    if (gradeFilter.trim().length > 0 && gradeFilter !== 'all')
      params.set('grade_filter', gradeFilter.toUpperCase())
    const query = params.toString()
    return query.length > 0 ? `/analytics/trends?${query}` : '/analytics/trends'
  }, [endDate, gradeFilter, startDate, stationFilter])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    stationFilter,
    setStationFilter,
    gradeFilter,
    setGradeFilter,
    trendsUrl,
  }
}
