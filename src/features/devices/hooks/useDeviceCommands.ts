import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type { ApiDeviceCommand } from '#/shared/api/contracts'
import { useFetch } from '#/shared/hooks/useApi'
import { normalizeCommand } from '../mappers/devices.mappers'
import type { FleetDevice, DeviceAction } from '../types/devices.types'

export type UseDeviceCommandsReturn = {
  commandHistory: ApiDeviceCommand[]
  latestCommand: ApiDeviceCommand | undefined
  queuedCommandName: string
  setQueuedCommandName: (name: string) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
  actionState: Record<string, string>
  queueCommand: (deviceId: string, command: string) => void
  runDeviceAction: (action: DeviceAction) => void
  handleQueueModalCommand: () => void
  isCommandPending: boolean
}

export function useDeviceCommands(
  selectedDevice: FleetDevice | undefined,
): UseDeviceCommandsReturn {
  const queryClient = useQueryClient()
  const [commandOpen, setCommandOpen] = useState(false)
  const [queuedCommandName, setQueuedCommandName] = useState('restart-app')
  const [actionState, setActionState] = useState<Record<string, string>>({})

  const { data: commandHistory = [] } = useFetch<ApiDeviceCommand[]>({
    url: selectedDevice
      ? `/devices/${selectedDevice.id}/commands?limit=20`
      : '/devices/placeholder/commands?limit=20',
    enabled: Boolean(selectedDevice),
    retry: false,
    refetchInterval: 10_000,
  })

  const commandMutation = useMutation({
    mutationFn: async (payload: { deviceId: string; command: string }) => {
      const response = await httpClient.post<ApiDeviceCommand>(
        `/devices/${payload.deviceId}/command`,
        { command: payload.command, args: { source: 'web-dashboard' } },
      )
      return response.data
    },
  })

  const queueCommand = (deviceId: string, command: string) => {
    commandMutation.mutate(
      { deviceId, command },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [`/devices/${deviceId}/commands?limit=20`],
          })
          setActionState((current) => ({
            ...current,
            [deviceId]: `Command queued (${command}) • ${new Date().toLocaleTimeString()}`,
          }))
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? 'Failed to queue command'
          setActionState((current) => ({
            ...current,
            [deviceId]: `${message} • ${new Date().toLocaleTimeString()}`,
          }))
        },
      },
    )
  }

  const runDeviceAction = (action: DeviceAction) => {
    if (!selectedDevice) return
    if (action !== 'view-device') {
      queueCommand(selectedDevice.id, action)
      return
    }
    setActionState((current) => ({
      ...current,
      [selectedDevice.id]: `Viewing device telemetry and controls • ${new Date().toLocaleTimeString()}`,
    }))
  }

  const handleQueueModalCommand = () => {
    if (!selectedDevice) return
    queueCommand(selectedDevice.id, normalizeCommand(queuedCommandName))
    setCommandOpen(false)
  }

  return {
    commandHistory,
    latestCommand: commandHistory.at(0),
    queuedCommandName,
    setQueuedCommandName,
    commandOpen,
    setCommandOpen,
    actionState,
    queueCommand,
    runDeviceAction,
    handleQueueModalCommand,
    isCommandPending: commandMutation.isPending,
  }
}
