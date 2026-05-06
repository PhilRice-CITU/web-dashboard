import { Plus } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'
import type { AnalyticsPreset } from '#/features/analytics/types/analytics.types'

type Props = {
  presets: AnalyticsPreset[]
  selectedPresetId: string | null
  onSelectPreset: (id: string | null) => void
  onApplyPreset: () => void
  onAddChart: () => void
}

export function PresetToolbar({
  presets,
  selectedPresetId,
  onSelectPreset,
  onApplyPreset,
  onAddChart,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={selectedPresetId ?? ''}
          onValueChange={(value) => onSelectPreset(value || null)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.length === 0 ? (
              <SelectItem value="" disabled>
                No presets available
              </SelectItem>
            ) : (
              presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={onApplyPreset}
          disabled={!selectedPresetId}
        >
          Apply Preset
        </Button>
      </div>
      <Button variant="outline" onClick={onAddChart}>
        <Plus className="mr-2 size-4" />
        Add Chart
      </Button>
    </div>
  )
}
