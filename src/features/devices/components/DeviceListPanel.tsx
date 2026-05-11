import { useNavigate } from '@tanstack/react-router'
import { Badge } from '#/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'
import { getStatusBadgeClass } from '../mappers/devices.mappers'
import type { FleetDevice } from '../types/devices.types'
import type { ApiRegion } from '#/shared/api/contracts'

type Props = {
  devices: FleetDevice[]
  isDevicesLoading: boolean
  devicesError: unknown
  regions: ApiRegion[] | undefined
  isSuperadmin: boolean
  userRegionId: string | null
  regionFilter: string | null
  onRegionFilterChange: (id: string | null) => void
}

export function DeviceListPanel({
  devices,
  isDevicesLoading,
  devicesError,
  regions,
  isSuperadmin,
  userRegionId,
  regionFilter,
  onRegionFilterChange,
}: Props) {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div>
          <h2 className="text-base font-semibold">Devices</h2>
          <p className="text-sm text-muted-foreground">
            Click a device to see its scan history and stats.
          </p>
        </div>

        {isSuperadmin && regions && (
          <Select
            value={regionFilter ?? 'all'}
            onValueChange={(val) =>
              onRegionFilterChange(val === 'all' ? null : val)
            }
          >
            <SelectTrigger className="h-8 w-44 text-xs">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectSeparator />
              {regions.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!isSuperadmin && userRegionId && regions && (
          <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {regions.find((r) => r.id === userRegionId)?.name ?? 'Your Region'}
          </span>
        )}
      </div>

      {!isDevicesLoading && devicesError && (
        <div className="px-4 py-3 text-sm text-rose-700">
          Failed to load devices.
        </div>
      )}

      {!isDevicesLoading && !devicesError && devices.length === 0 && (
        <div className="px-4 py-4 text-sm text-muted-foreground">
          No devices yet. Add one to start collecting scans.
        </div>
      )}

      <div className="divide-y divide-border">
        {devices.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() =>
              navigate({
                to: '/devices/$deviceId',
                params: { deviceId: device.id },
              })
            }
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-muted/50 md:px-5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {device.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {device.id} • {device.regionName}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Last seen:{' '}
                {device.lastSeen
                  ? new Date(device.lastSeen).toLocaleString()
                  : 'Never'}
              </span>
              <Badge className={getStatusBadgeClass(device.status)}>
                {device.status}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
