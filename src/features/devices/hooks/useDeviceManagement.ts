import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '#/shared/api/client'
import type { ApiDevice } from '#/shared/api/contracts'
import type { FleetDevice } from '../types/devices.types'

export type UseDeviceManagementReturn = {
  addDeviceOpen: boolean
  setAddDeviceOpen: (open: boolean) => void
  newDeviceCode: string
  setNewDeviceCode: (code: string) => void
  handleSaveDevice: () => void
  handleDisconnectSelectedDevice: () => void
  isCreatePending: boolean
  isDisconnectPending: boolean
}

export function useDeviceManagement(
  selectedDevice: FleetDevice | undefined,
  setActionState: (
    fn: (current: Record<string, string>) => Record<string, string>,
  ) => void,
): UseDeviceManagementReturn {
  const queryClient = useQueryClient()
  const [addDeviceOpen, setAddDeviceOpen] = useState(false)
  const [newDeviceCode, setNewDeviceCode] = useState('')

  const createDeviceMutation = useMutation({
    mutationFn: async (payload: {
      display_name?: string
      device_id?: string
    }) => {
      const response = await httpClient.post<ApiDevice>('/devices', payload)
      return response.data
    },
    onSuccess: (createdDevice) => {
      queryClient.invalidateQueries({ queryKey: ['/devices'] })
      setAddDeviceOpen(false)
      setActionState((current) => ({
        ...current,
        [createdDevice.id]: `Device connected • ${new Date().toLocaleTimeString()}`,
      }))
      setNewDeviceCode('')
    },
  })

  const disconnectDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      const response = await httpClient.post<ApiDevice>(
        `/devices/${deviceId}/disconnect`,
      )
      return response.data
    },
  })

  const handleSaveDevice = () => {
    const deviceId = newDeviceCode.trim()
    if (!deviceId) return
    createDeviceMutation.mutate(
      { device_id: deviceId },
      {
        onError: (error) => {
          const message =
            (error as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? 'Failed to connect device'
          setActionState((current) => ({
            ...current,
            [deviceId]: `${message} • ${new Date().toLocaleTimeString()}`,
          }))
        },
      },
    )
  }

  const handleDisconnectSelectedDevice = () => {
    if (!selectedDevice) return
    disconnectDeviceMutation.mutate(selectedDevice.id, {
      onSuccess: (updatedDevice) => {
        queryClient.invalidateQueries({ queryKey: ['/devices'] })
        setActionState((current) => ({
          ...current,
          [updatedDevice.id]: `Device disconnected • ${new Date().toLocaleTimeString()}`,
        }))
      },
      onError: (error) => {
        const message =
          (error as { response?: { data?: { detail?: string } } }).response
            ?.data?.detail ?? 'Failed to disconnect device'
        setActionState((current) => ({
          ...current,
          [selectedDevice.id]: `${message} • ${new Date().toLocaleTimeString()}`,
        }))
      },
    })
  }

  return {
    addDeviceOpen,
    setAddDeviceOpen,
    newDeviceCode,
    setNewDeviceCode,
    handleSaveDevice,
    handleDisconnectSelectedDevice,
    isCreatePending: createDeviceMutation.isPending,
    isDisconnectPending: disconnectDeviceMutation.isPending,
  }
}
