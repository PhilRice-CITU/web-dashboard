import { SaveIcon, Trash2Icon } from 'lucide-react'

import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'

import type { AnalyticsPreset } from '#/features/analytics/types/analytics.types'

type PresetManagerProps = {
  presets: AnalyticsPreset[]
  selectedPresetId: string | null
  draftPresetName: string
  onDraftPresetNameChange: (value: string) => void
  onSavePreset: () => void
  onLoadPreset: (presetId: string) => void
  onDeletePreset: (presetId: string) => void
}

export function PresetManager({
  presets,
  selectedPresetId,
  draftPresetName,
  onDraftPresetNameChange,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: PresetManagerProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={draftPresetName}
          onChange={(event) => onDraftPresetNameChange(event.target.value)}
          placeholder="Preset name"
          className="sm:max-w-xs"
        />
        <Button onClick={onSavePreset} className="sm:w-auto">
          <SaveIcon className="mr-2 size-4" />
          Save Preset
        </Button>
      </div>

      <div className="space-y-2">
        {presets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No saved presets yet. Save your first chart layout.
          </p>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border p-2"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {preset.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(preset.createdAt).toLocaleString()} •{' '}
                  {preset.charts.length} chart
                  {preset.charts.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={
                    selectedPresetId === preset.id ? 'secondary' : 'outline'
                  }
                  size="sm"
                  onClick={() => onLoadPreset(preset.id)}
                >
                  Load
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="text-rose-700"
                  onClick={() => onDeletePreset(preset.id)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
