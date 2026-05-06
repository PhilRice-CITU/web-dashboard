import axios from 'axios'
import { supabase } from '#/shared/lib/supabase'

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
