import { AnalyticsChartCard } from '#/components/analytics/AnalyticsChartCard'
import { ChartBuilderControls } from '#/components/analytics/ChartBuilderControls'
import type { ChartBuilderConfig } from '#/components/analytics/types'
import type { AnalyticsData } from '#/lib/mockData'
import { renderChart } from '../utils/analytics.utils'

type Props = {
  charts: ChartBuilderConfig[]
  chartDataMap: Record<string, AnalyticsData[]>
  editingChartId: string | null
  onToggleEdit: (chartId: string) => void
  onUpdateChart: (chart: ChartBuilderConfig) => void
  onRemoveChart: (chartId: string) => void
}

export function ChartGrid({
  charts,
  chartDataMap,
  editingChartId,
  onToggleEdit,
  onUpdateChart,
  onRemoveChart,
}: Props) {
  return (
    <div className="mb-0 grid grid-cols-1 border-y border-border lg:grid-cols-2">
      {charts.map((chart, index) => (
        <div
          key={chart.id}
          className="border-b border-border last:border-b-0 lg:odd:border-r lg:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
        >
          <AnalyticsChartCard
            title={chart.title}
            subtitle={`Chart ${index + 1} • ${chart.aggregation.toUpperCase()} • ${chart.granularity}`}
            isEditing={editingChartId === chart.id}
            onToggleEdit={() => onToggleEdit(chart.id)}
            controls={
              editingChartId === chart.id ? (
                <ChartBuilderControls
                  config={chart}
                  onChange={onUpdateChart}
                  onRemove={onRemoveChart}
                />
              ) : null
            }
          >
            {renderChart(chart, chartDataMap[chart.id] ?? [])}
          </AnalyticsChartCard>
        </div>
      ))}
    </div>
  )
}
