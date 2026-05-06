import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  getMetricColor,
  getMetricLabel,
} from '#/features/analytics/components/charts/chartUtils'
import type { BaseAnalyticsChartProps } from '#/features/analytics/components/charts/types'

export function LineAnalyticsChart({
  data,
  primaryMetric,
  secondaryMetric,
}: BaseAnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={primaryMetric}
          stroke={getMetricColor(0)}
          strokeWidth={2.5}
          dot={false}
          name={getMetricLabel(primaryMetric)}
        />
        {secondaryMetric ? (
          <Line
            type="monotone"
            dataKey={secondaryMetric}
            stroke={getMetricColor(1)}
            strokeWidth={2}
            dot={false}
            name={getMetricLabel(secondaryMetric)}
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  )
}
