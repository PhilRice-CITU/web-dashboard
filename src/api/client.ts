import axios from 'axios'
import createClient from 'openapi-fetch'
import type { ClientOptions } from 'openapi-fetch'
import type { paths } from './types/openapi'
import { supabase } from '#/lib/supabase'

export const createApiClient = (options?: ClientOptions) => {
  return createClient<paths>({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    ...options,
  })
}

export const apiClient = createApiClient()

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
