import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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

export function ComposedAnalyticsChart({
  data,
  primaryMetric,
  secondaryMetric,
}: BaseAnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={primaryMetric}
          fill={getMetricColor(0)}
          name={getMetricLabel(primaryMetric)}
          radius={[4, 4, 0, 0]}
        />
        {secondaryMetric ? (
          <Line
            type="monotone"
            dataKey={secondaryMetric}
            stroke={getMetricColor(1)}
            strokeWidth={2.2}
            dot={false}
            name={getMetricLabel(secondaryMetric)}
          />
        ) : null}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
