import createClient, { type ClientOptions } from 'openapi-fetch'
import type { paths } from './types/openapi' // This will be generated from your OpenAPI schema

/**
 * Configure your OpenAPI client here
 *
 * Example usage:
 * ```
 * const { data, error } = await client.GET('/api/users/{id}', {
 *   params: { path: { id: '123' } }
 * });
 * ```
 */
export const createApiClient = (options?: ClientOptions) => {
  return createClient<paths>({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    ...options,
  })
}

// Export a default instance
export const apiClient = createApiClient()

/**
 * Configure axios for non-OpenAPI endpoints
 */
import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth tokens
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
