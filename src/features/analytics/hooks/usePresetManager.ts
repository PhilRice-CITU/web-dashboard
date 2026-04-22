import { useEffect, useState } from 'react'
import type { AnalyticsPreset } from '#/components/analytics/types'

const PRESET_STORAGE_KEY = 'analytics-builder-presets-v1'
const PRESET_SCHEMA_VERSION = 1

export type UsePresetManagerReturn = {
  presets: AnalyticsPreset[]
  presetError: string | null
  selectedPresetId: string | null
  setSelectedPresetId: (id: string | null) => void
  loadPreset: (
    presetId: string,
    applyCharts: (charts: AnalyticsPreset['charts']) => void,
  ) => void
}

export function usePresetManager(): UsePresetManagerReturn {
  const [presets, setPresets] = useState<AnalyticsPreset[]>([])
  const [presetError, setPresetError] = useState<string | null>(null)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(PRESET_STORAGE_KEY)
      if (!storedValue) return
      const parsed = JSON.parse(storedValue) as AnalyticsPreset[]
      const safePresets = parsed.filter(
        (preset) => preset.schemaVersion === PRESET_SCHEMA_VERSION,
      )
      setPresets(safePresets)
      setPresetError(null)
    } catch {
      setPresetError('Saved presets could not be loaded. Storage was reset.')
      localStorage.removeItem(PRESET_STORAGE_KEY)
    }
  }, [])

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets))
  }, [presets])

  const loadPreset = (
    presetId: string,
    applyCharts: (charts: AnalyticsPreset['charts']) => void,
  ) => {
    const preset = presets.find((entry) => entry.id === presetId)
    if (!preset) return
    applyCharts(preset.charts)
    setSelectedPresetId(preset.id)
  }

  return {
    presets,
    presetError,
    selectedPresetId,
    setSelectedPresetId,
    loadPreset,
  }
}
