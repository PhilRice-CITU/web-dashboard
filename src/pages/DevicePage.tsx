import type { ReactNode } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Cpu, MapPin, Wifi } from 'lucide-react'
import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import { Badge } from '#/shared/components/ui/badge'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { httpClient } from '#/shared/api/client'

interface DeviceDetail {
  id: string
  display_name: string
  status: string
  region_id: string
  last_seen: string | null
  created_at: string
  updated_at: string
}

export function DevicePage() {
  const { deviceId } = useParams({ from: '/_authenticated/devices/$deviceId' })

  const {
    data: device,
    isLoading,
    isError,
  } = useQuery<DeviceDetail>({
    queryKey: ['device', deviceId],
    queryFn: async () => {
      const res = await httpClient.get<DeviceDetail>(`/devices/${deviceId}`)
      return res.data
    },
    staleTime: 30_000,
  })

  const statusVariant: 'default' | 'secondary' =
    device?.status === 'active' ? 'default' : 'secondary'

  return (
    <PlatformShell
      title={device?.display_name ?? 'Device'}
      description="Device details"
    >
      <div className="p-6">
        <Link
          to="/devices"
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to fleet
        </Link>

        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {isError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load device. It may not exist or you may not have access.
          </p>
        )}

        {device && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {device.display_name}
              </h1>
              <Badge variant={statusVariant}>{device.status}</Badge>
            </div>

            <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-card">
              <InfoRow
                icon={<Cpu size={16} />}
                label="Device ID"
                value={device.id}
              />
              <InfoRow
                icon={<Wifi size={16} />}
                label="Status"
                value={device.status}
              />
              <InfoRow
                icon={<MapPin size={16} />}
                label="Region ID"
                value={device.region_id}
              />
              <InfoRow
                label="Last seen"
                value={
                  device.last_seen
                    ? new Date(device.last_seen).toLocaleString()
                    : 'Never'
                }
              />
              <InfoRow
                label="Registered"
                value={new Date(device.created_at).toLocaleDateString()}
              />
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm [&+&]:border-t [&+&]:border-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
