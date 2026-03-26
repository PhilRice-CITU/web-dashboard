import {
  Area,
  AreaChart,
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

export function AreaAnalyticsChart({
  data,
  primaryMetric,
  secondaryMetric,
}: BaseAnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey={primaryMetric}
          stroke={getMetricColor(0)}
          fill={getMetricColor(0)}
          fillOpacity={0.26}
          name={getMetricLabel(primaryMetric)}
        />
        {secondaryMetric ? (
          <Area
            type="monotone"
            dataKey={secondaryMetric}
            stroke={getMetricColor(1)}
            fill={getMetricColor(1)}
            fillOpacity={0.22}
            name={getMetricLabel(secondaryMetric)}
          />
        ) : null}
      </AreaChart>
    </ResponsiveContainer>
  )
}
