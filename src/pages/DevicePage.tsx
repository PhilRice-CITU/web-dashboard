import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { httpClient } from '#/shared/api/client'
import { useRegions } from '#/features/devices/hooks/useRegions'
import { DeviceInfoCard } from '#/features/devices/components/DeviceInfoCard'
import { DeviceStatsRow } from '#/features/devices/components/DeviceStatsRow'
import { DeviceResultsTable } from '#/features/devices/components/DeviceResultsTable'
import { DeviceEventsPanel } from '#/features/devices/components/DeviceEventsPanel'
import type { ApiDevice } from '#/shared/api/contracts'

export function DevicePage() {
  const { deviceId } = useParams({ from: '/_authenticated/devices_/$deviceId' })

  const {
    data: device,
    isLoading,
    isError,
  } = useQuery<ApiDevice>({
    queryKey: ['device', deviceId],
    queryFn: async () => {
      const { data } = await httpClient.get<ApiDevice>(`/devices/${deviceId}`)
      return data
    },
    staleTime: 30_000,
  })

  const { data: regions } = useRegions()
  const regionName =
    regions?.find((r) => r.id === device?.region_id)?.name ?? 'Unknown region'

  return (
    <PlatformShell
      title={device?.display_name ?? 'Device'}
      description="Device details"
    >
      <div className="flex flex-col gap-6 p-6">
        <Link
          to="/devices"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to fleet
        </Link>

        {isLoading && (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        )}

        {isError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load device. It may not exist or you may not have access.
          </p>
        )}

        {device && (
          <>
            <DeviceInfoCard
              id={device.id}
              name={device.display_name}
              status={device.status}
              regionName={regionName}
              lastSeen={device.last_seen}
              createdAt={device.created_at}
            />
            <DeviceStatsRow
              deviceId={device.id}
              lastScanAt={device.last_seen}
            />
            <DeviceResultsTable deviceId={device.id} />
            <section className="space-y-3">
              <h2 className="text-base font-semibold">Device events</h2>
              <DeviceEventsPanel deviceId={device.id} />
            </section>
          </>
        )}
      </div>
    </PlatformShell>
  )
}
