import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  deviceId?: string
}

interface Device {
  id: string
  name: string
  group?: string
  lastSeen?: string
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // Device state
  devices: Device[]
  setDevices: (devices: Device[]) => void
  addDevice: (device: Device) => void
  removeDevice: (deviceId: string) => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

/**
 * Global application state using Zustand
 *
 * Usage:
 * ```
 * const { user, isAuthenticated } = useAppStore();
 * ```
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        devices: [],
        sidebarOpen: true,

        // User actions
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

        // Device actions
        setDevices: (devices) => set({ devices }),

        addDevice: (device) =>
          set((state) => ({
            devices: [...state.devices, device],
          })),

        removeDevice: (deviceId) =>
          set((state) => ({
            devices: state.devices.filter((d) => d.id !== deviceId),
          })),

        // UI actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
      }),
      {
        name: 'app-store', // localStorage key
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
        }),
      },
    ),
    { name: 'AppStore' },
  ),
)
