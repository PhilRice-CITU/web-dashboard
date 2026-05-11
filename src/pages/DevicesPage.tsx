import { useState } from 'react'

import { PlatformShell } from '#/shared/components/layout/PlatformShell'

import { useCurrentUser } from '#/features/auth/hooks/useCurrentUser'
import { useDeviceFleet } from '#/features/devices/hooks/useDeviceFleet'
import { DeviceMetricsBar } from '#/features/devices/components/DeviceMetricsBar'
import { DeviceListPanel } from '#/features/devices/components/DeviceListPanel'

export function DevicesPage() {
  const [regionFilter, setRegionFilter] = useState<string | null>(null)

  const { isSuperadmin, regionId: userRegionId } = useCurrentUser()
  const fleet = useDeviceFleet(regionFilter)

  return (
    <PlatformShell
      title="Device Fleet"
      description="View edge devices and review per-device scan history."
    >
      <section className="overflow-hidden border-b border-border">
        <DeviceMetricsBar devices={fleet.devices} />

        <div className="border-t border-border">
          <DeviceListPanel
            devices={fleet.devices}
            isDevicesLoading={fleet.isDevicesLoading}
            devicesError={fleet.devicesError}
            regions={fleet.regions}
            isSuperadmin={isSuperadmin}
            userRegionId={userRegionId}
            regionFilter={regionFilter}
            onRegionFilterChange={setRegionFilter}
          />
        </div>
      </section>
    </PlatformShell>
  )
}
