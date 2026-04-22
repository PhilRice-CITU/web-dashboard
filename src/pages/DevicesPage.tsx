import { useState } from 'react'

import { PlatformShell } from '#/components/layout/PlatformShell'

import { useDeviceFleet } from '#/features/devices/hooks/useDeviceFleet'
import { useDeviceCommands } from '#/features/devices/hooks/useDeviceCommands'
import { useDeviceStream } from '#/features/devices/hooks/useDeviceStream'
import { useDeviceManagement } from '#/features/devices/hooks/useDeviceManagement'
import { DeviceMetricsBar } from '#/features/devices/components/DeviceMetricsBar'
import { DeviceListPanel } from '#/features/devices/components/DeviceListPanel'
import { DeviceDetailPanel } from '#/features/devices/components/DeviceDetailPanel'
import { AddDeviceSheet } from '#/features/devices/components/AddDeviceSheet'
import { SendCommandSheet } from '#/features/devices/components/SendCommandSheet'

export function DevicesPage() {
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)
  const [actionState, setActionState] = useState<Record<string, string>>({})

  const fleet = useDeviceFleet()
  const commands = useDeviceCommands(fleet.selectedDevice)
  const stream = useDeviceStream(fleet.selectedDevice, setActionState)
  const management = useDeviceManagement(fleet.selectedDevice, setActionState)

  const handleSelectDevice = (id: string) => {
    fleet.setSelectedDeviceId(id)
    if (isRightPanelCollapsed) setIsRightPanelCollapsed(false)
  }

  const handleExpandDevice = (id: string) => {
    fleet.setSelectedDeviceId(id)
    setIsRightPanelCollapsed(false)
    setActionState((current) => ({
      ...current,
      [id]: `Viewing device telemetry and controls • ${new Date().toLocaleTimeString()}`,
    }))
  }

  return (
    <PlatformShell
      title="Device Fleet"
      description="Manage edge devices, trigger actions, and monitor station readiness."
      actions={
        <>
          <SendCommandSheet
            open={commands.commandOpen}
            onOpenChange={commands.setCommandOpen}
            selectedDevice={fleet.selectedDevice}
            commandName={commands.queuedCommandName}
            onCommandNameChange={commands.setQueuedCommandName}
            onQueue={commands.handleQueueModalCommand}
            isPending={commands.isCommandPending}
          />
          <AddDeviceSheet
            open={management.addDeviceOpen}
            onOpenChange={management.setAddDeviceOpen}
            deviceCode={management.newDeviceCode}
            onDeviceCodeChange={management.setNewDeviceCode}
            onSave={management.handleSaveDevice}
            isPending={management.isCreatePending}
          />
        </>
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
          />

          {!isRightPanelCollapsed && (
            <DeviceDetailPanel
              selectedDevice={fleet.selectedDevice}
              commandHistory={commands.commandHistory}
              latestCommand={commands.latestCommand}
              liveFrameSrc={stream.liveFrameSrc}
              activeStreamSessionId={stream.activeStreamSessionId}
              liveConnectionStatus={stream.liveConnectionStatus}
              actionState={actionState}
              isDisconnectPending={management.isDisconnectPending}
              onCollapse={() => setIsRightPanelCollapsed(true)}
              onStartStream={stream.handleStartCameraStream}
              onStopStream={stream.handleStopCameraStream}
              onDeviceAction={commands.runDeviceAction}
              onDisconnect={management.handleDisconnectSelectedDevice}
            />
          )}
        </div>
      </section>
    </PlatformShell>
  )
}
