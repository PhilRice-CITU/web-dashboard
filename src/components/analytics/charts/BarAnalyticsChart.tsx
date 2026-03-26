import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  getMetricColor,
  getMetricLabel,
} from '#/components/analytics/charts/chartUtils'
import type { BaseAnalyticsChartProps } from '#/components/analytics/charts/types'

export function BarAnalyticsChart({
  data,
  primaryMetric,
  secondaryMetric,
}: BaseAnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={primaryMetric}
          fill={getMetricColor(0)}
          radius={[4, 4, 0, 0]}
          name={getMetricLabel(primaryMetric)}
        />
        {secondaryMetric ? (
          <Bar
            dataKey={secondaryMetric}
            fill={getMetricColor(1)}
            radius={[4, 4, 0, 0]}
            name={getMetricLabel(secondaryMetric)}
          />
        ) : null}
      </BarChart>
    </ResponsiveContainer>
  )
}
