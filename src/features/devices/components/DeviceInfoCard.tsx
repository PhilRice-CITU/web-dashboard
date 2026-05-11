import type { ReactNode } from 'react'
import { Cpu, MapPin, Wifi, Calendar } from 'lucide-react'
import { Badge } from '#/shared/components/ui/badge'
import { getStatusBadgeClass } from '../mappers/devices.mappers'

type Props = {
  id: string
  name: string
  status: string
  regionName: string
  lastSeen: string | null
  createdAt: string
}

export function DeviceInfoCard({
  id,
  name,
  status,
  regionName,
  lastSeen,
  createdAt,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-foreground">{name}</h2>
        <Badge className={getStatusBadgeClass(status)}>{status}</Badge>
      </div>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <Row icon={<Cpu size={14} />} label="Device ID" value={id} mono />
        <Row icon={<MapPin size={14} />} label="Region" value={regionName} />
        <Row
          icon={<Wifi size={14} />}
          label="Last seen"
          value={lastSeen ? new Date(lastSeen).toLocaleString() : 'Never'}
        />
        <Row
          icon={<Calendar size={14} />}
          label="Registered"
          value={new Date(createdAt).toLocaleDateString()}
        />
      </dl>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon: ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span
        className={`truncate font-medium text-foreground ${mono ? 'font-mono text-xs' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}
