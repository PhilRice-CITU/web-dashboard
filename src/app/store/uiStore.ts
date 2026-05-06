import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,

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
