import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
}

interface Device {
  id: string
  name: string
  group?: string
  lastSeen?: string
  status?: 'inactive' | 'scanning' | 'active'
  cpu?: number
  latitude?: number
  longitude?: number
  location?: string
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  devices: Device[]
  setDevices: (devices: Device[]) => void
  addDevice: (device: Device) => void
  removeDevice: (deviceId: string) => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        devices: [],
        sidebarOpen: true,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: user !== null,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            devices: [],
          }),

        setDevices: (devices) => set({ devices }),

        addDevice: (device) =>
          set((state) => ({
            devices: [...state.devices, device],
          })),

        removeDevice: (deviceId) =>
          set((state) => ({
            devices: state.devices.filter((d) => d.id !== deviceId),
          })),

        setSidebarOpen: (open) => set({ sidebarOpen: open }),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
        }),
      },
    ),
    { name: 'AppStore' },
  ),
)
