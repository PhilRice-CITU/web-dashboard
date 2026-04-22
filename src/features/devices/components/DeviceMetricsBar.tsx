import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { FleetDevice } from '../types/devices.types'

type Props = {
  devices: FleetDevice[]
}

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

export function DeviceMetricsBar({ devices }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <MetricCard label="Total Devices" value={String(devices.length)} />
      <MetricCard
        label="Online"
        value={String(devices.filter((d) => d.status !== 'inactive').length)}
      />
      <MetricCard
        label="In Maintenance"
        value={String(devices.filter((d) => d.status === 'scanning').length)}
      />
    </div>
  )
}
