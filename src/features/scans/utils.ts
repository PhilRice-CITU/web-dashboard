import type { AxiosError } from 'axios'

export function axiosErrorDetail(
  error: AxiosError | null | undefined,
  fallback: string,
): string {
  if (!error) return fallback
  const data = error.response?.data as { detail?: string } | undefined
  return data?.detail ?? fallback
}
