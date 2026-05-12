import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { supabase } from '#/shared/lib/supabase'
import type {
  CreateSessionResponse,
  SessionMetadata,
  SubmitSessionResponse,
  UploadPair,
} from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

function edgeClient(deviceId: string): AxiosInstance {
  const instance = axios.create({ baseURL })
  instance.interceptors.request.use(async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    config.headers['X-Device-ID'] = deviceId
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  })
  return instance
}

export async function createTestSession(
  deviceId: string,
  meta: SessionMetadata,
): Promise<CreateSessionResponse> {
  const body = {
    mode: 'grade' as const,
    operator_name: meta.operator_name,
    session_name: meta.session_name || null,
    rice_variety: meta.rice_variety || null,
  }
  const { data } = await edgeClient(deviceId).post<CreateSessionResponse>(
    '/edge/v1/sessions',
    body,
  )
  return data
}

export async function submitTestSession(
  deviceId: string,
  sessionId: string,
  pairs: UploadPair[],
  meta: SessionMetadata,
): Promise<SubmitSessionResponse> {
  const form = new FormData()
  for (const pair of pairs) {
    if (!pair.raw || !pair.ir) {
      throw new Error('All pairs must have both raw (white-LED) and IR images')
    }
    form.append('raw_images', pair.raw)
    form.append('ir_images', pair.ir)
  }
  if (meta.operator_name) form.append('operator_name', meta.operator_name)
  if (meta.rice_variety) form.append('rice_variety', meta.rice_variety)

  const { data } = await edgeClient(deviceId).post<SubmitSessionResponse>(
    `/edge/v1/sessions/${sessionId}/submit`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}
