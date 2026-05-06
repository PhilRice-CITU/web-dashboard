import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * Create a singleton QueryClient for the app
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface QueryClientProviderProps {
  children: ReactNode
}

/**
 * Wrap your app with this provider
 *
 * Usage:
 * ```
 * <QueryClientProvider>
 *   <App />
 * </QueryClientProvider>
 * ```
 */
export const QueryProvider = ({ children }: QueryClientProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

export { queryClient }
