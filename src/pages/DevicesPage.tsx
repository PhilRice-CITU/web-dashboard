import { useState } from 'react'

import { PlatformShell } from '#/shared/components/layout/PlatformShell'

import { useCurrentUser } from '#/features/auth/hooks/useCurrentUser'
import { useDeviceFleet } from '#/features/devices/hooks/useDeviceFleet'
import { useDeviceManagement } from '#/features/devices/hooks/useDeviceManagement'
import { DeviceMetricsBar } from '#/features/devices/components/DeviceMetricsBar'
import { DeviceListPanel } from '#/features/devices/components/DeviceListPanel'
import { DeviceDetailPanel } from '#/features/devices/components/DeviceDetailPanel'
import { AddDeviceSheet } from '#/features/devices/components/AddDeviceSheet'

export function DevicesPage() {
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)
  const [regionFilter, setRegionFilter] = useState<string | null>(null)

  const { isSuperadmin, regionId: userRegionId } = useCurrentUser()
  const fleet = useDeviceFleet(regionFilter)
  const management = useDeviceManagement(fleet.selectedDevice, (_fn) => {})

  const handleSelectDevice = (id: string) => {
    fleet.setSelectedDeviceId(id)
    if (isRightPanelCollapsed) setIsRightPanelCollapsed(false)
  }

  const handleExpandDevice = (id: string) => {
    fleet.setSelectedDeviceId(id)
    setIsRightPanelCollapsed(false)
  }

  return (
    <PlatformShell
      title="Device Fleet"
      description="Manage edge devices and monitor station readiness."
      actions={
        <AddDeviceSheet
          open={management.addDeviceOpen}
          onOpenChange={management.setAddDeviceOpen}
          deviceCode={management.newDeviceCode}
          onDeviceCodeChange={management.setNewDeviceCode}
          onSave={management.handleSaveDevice}
          isPending={management.isCreatePending}
        />
      }
    >
      <section className="overflow-hidden border-b border-border">
        <DeviceMetricsBar devices={fleet.devices} />

        <div
          className={`grid grid-cols-1 border-t border-border ${
            isRightPanelCollapsed
              ? 'xl:grid-cols-1'
              : 'xl:grid-cols-[1.2fr_1.8fr]'
          }`}
        >
          <DeviceListPanel
            devices={fleet.devices}
            selectedDeviceId={fleet.selectedDeviceId}
            isRightPanelCollapsed={isRightPanelCollapsed}
            isDevicesLoading={fleet.isDevicesLoading}
            devicesError={fleet.devicesError}
            onSelectDevice={handleSelectDevice}
            onExpandDevice={handleExpandDevice}
            regions={fleet.regions}
            isSuperadmin={isSuperadmin}
            userRegionId={userRegionId}
            regionFilter={regionFilter}
            onRegionFilterChange={setRegionFilter}
          />

          {!isRightPanelCollapsed && (
            <DeviceDetailPanel
              selectedDevice={fleet.selectedDevice}
              isDisconnectPending={management.isDisconnectPending}
              onCollapse={() => setIsRightPanelCollapsed(true)}
              onDisconnect={management.handleDisconnectSelectedDevice}
            />
          )}
        </div>
      </section>
    </PlatformShell>
  )
}
