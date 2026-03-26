import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import {
  getMetricColor,
  getMetricLabel,
  getMetricValue,
} from '#/components/analytics/charts/chartUtils'
import type { BaseAnalyticsChartProps } from '#/components/analytics/charts/types'

export function PieAnalyticsChart({
  data,
  primaryMetric,
  secondaryMetric,
}: BaseAnalyticsChartProps) {
  const latest = data[Math.max(data.length - 1, 0)]

  const pieData = [
    {
      name: getMetricLabel(primaryMetric),
      value: Number(getMetricValue(latest, primaryMetric)),
    },
  ]

  if (secondaryMetric) {
    pieData.push({
      name: getMetricLabel(secondaryMetric),
      value: Number(getMetricValue(latest, secondaryMetric)),
    })
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={110}
          paddingAngle={3}
        >
          {pieData.map((entry, index) => (
            <Cell key={entry.name} fill={getMetricColor(index)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
