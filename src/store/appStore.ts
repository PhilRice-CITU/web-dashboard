import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Theme state
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
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
        sidebarOpen: true,
        theme: 'light',

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: user !== null,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),

        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'app-store', // localStorage key
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      },
    ),
    { name: 'AppStore' },
  ),
)
