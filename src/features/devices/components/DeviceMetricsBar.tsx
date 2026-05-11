import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { useFetch } from '#/shared/hooks/useApi'
import type { ApiDashboardSummary } from '#/shared/api/contracts'
import type { FleetDevice } from '../types/devices.types'

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-none border-0 border-b border-border ring-0 md:border-r md:last:border-r-0 md:border-b-0">
      <CardHeader className="p-5">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mono text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export function DeviceMetricsBar({ devices }: { devices: FleetDevice[] }) {
  const { data } = useFetch<ApiDashboardSummary>({
    url: '/analytics/dashboard',
    staleTime: 60_000,
  })

  const total = devices.length
  const active = devices.filter((d) => d.status === 'active').length
  const scansToday = data?.scans_processed_today ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <MetricCard label="Total Devices" value={String(total)} />
      <MetricCard label="Active Devices" value={String(active)} />
      <MetricCard label="Scans Today" value={String(scansToday)} />
    </div>
  )
}
