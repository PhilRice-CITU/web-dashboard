import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { httpClient } from '#/api/client'
import type { AxiosError } from 'axios'

/**
 * Custom hooks for common API operations
 */

interface FetchOptions<T> extends Omit<
  UseQueryOptions<T>,
  'queryKey' | 'queryFn'
> {
  url: string
  enabled?: boolean
}

/**
 * Hook for fetching data
 *
 * Usage:
 * ```
 * const { data, isLoading, error } = useFetch('/api/users', {
 *   staleTime: 1000 * 60 * 5, // 5 minutes
 * });
 * ```
 */
export const useFetch = <T>({
  url,
  enabled = true,
  ...options
}: FetchOptions<T>) => {
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await httpClient.get<T>(url)
      return response.data
    },
    enabled,
    ...options,
  })
}

/**
 * Hook for creating/posting data
 *
 * Usage:
 * ```
 * const { mutate } = useCreate('/api/users');
 * mutate({ name: 'John', email: 'john@example.com' });
 * ```
 */
export const useCreate = <T, D = unknown>(url: string) => {
  return useMutation<T, AxiosError, D>({
    mutationFn: async (data: D) => {
      const response = await httpClient.post<T>(url, data)
      return response.data
    },
  })
}

/**
 * Hook for updating data
 */
export const useUpdate = <T, D = unknown>(url: string) => {
  return useMutation<T, AxiosError, D>({
    mutationFn: async (data: D) => {
      const response = await httpClient.patch<T>(url, data)
      return response.data
    },
  })
}

/**
 * Hook for deleting data
 */
export const useDelete = <T>(url: string) => {
  return useMutation<T, AxiosError>({
    mutationFn: async () => {
      const response = await httpClient.delete<T>(url)
      return response.data
    },
  })
}
