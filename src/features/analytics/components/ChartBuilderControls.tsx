import { Trash2Icon } from 'lucide-react'

import {
  analyticsAggregationOptions,
  analyticsChartTypes,
  analyticsGranularityOptions,
  analyticsMetricCatalog,
} from '#/features/analytics/constants/analyticsCatalog'
import { Button } from '#/shared/components/ui/button'
import { Label } from '#/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'

import type { ChartBuilderConfig } from '#/features/analytics/types/analytics.types'

type ChartBuilderControlsProps = {
  config: ChartBuilderConfig
  onChange: (nextConfig: ChartBuilderConfig) => void
  onRemove: (chartId: string) => void
}

export function ChartBuilderControls({
  config,
  onChange,
  onRemove,
}: ChartBuilderControlsProps) {
  const availablePrimaryMetrics = analyticsMetricCatalog.filter((metric) =>
    metric.allowedChartTypes.includes(config.chartType),
  )

  const availableSecondaryMetrics = availablePrimaryMetrics.filter(
    (metric) => metric.key !== config.primaryMetric,
  )

  return (
    <div className="space-y-4 rounded-lg border border-border bg-background p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Chart Type</Label>
          <Select
            value={config.chartType}
            onValueChange={(value) =>
              onChange({
                ...config,
                chartType: value as ChartBuilderConfig['chartType'],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {analyticsChartTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Primary Metric</Label>
          <Select
            value={config.primaryMetric}
            onValueChange={(value) =>
              onChange({
                ...config,
                primaryMetric: value as ChartBuilderConfig['primaryMetric'],
                secondaryMetric:
                  value === config.secondaryMetric
                    ? undefined
                    : config.secondaryMetric,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePrimaryMetrics.map((metric) => (
                <SelectItem key={metric.key} value={metric.key}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Secondary Metric</Label>
          <Select
            value={config.secondaryMetric ?? ''}
            onValueChange={(value) =>
              onChange({
                ...config,
                secondaryMetric:
                  !value || value.length === 0
                    ? undefined
                    : (value as ChartBuilderConfig['primaryMetric']),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {availableSecondaryMetrics.map((metric) => (
                <SelectItem key={metric.key} value={metric.key}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Aggregation</Label>
          <Select
            value={config.aggregation}
            onValueChange={(value) =>
              onChange({
                ...config,
                aggregation: value as ChartBuilderConfig['aggregation'],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {analyticsAggregationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Time Granularity</Label>
          <Select
            value={config.granularity}
            onValueChange={(value) =>
              onChange({
                ...config,
                granularity: value as ChartBuilderConfig['granularity'],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {analyticsGranularityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-rose-700"
          onClick={() => onRemove(config.id)}
        >
          <Trash2Icon className="mr-2 size-4" />
          Remove Chart
        </Button>
      </div>
    </div>
  )
}
