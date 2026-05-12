import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { httpClient } from '#/shared/api/client'
import type {
  ApiCorrectionHistoryResponse,
  ApiGradeOverrideRequest,
  ApiGrainCorrectionRequest,
  ApiResult,
  ApiResultImageSignedUrl,
  ResultImageVariant,
} from '#/shared/api/contracts'

const RESULT_KEY = (id: string) => ['result', id] as const
const IMAGE_KEY = (id: string, variant: ResultImageVariant) =>
  ['result', id, 'image', variant] as const
const HISTORY_KEY = (id: string) => ['result', id, 'corrections'] as const

const PROCESSING_REFETCH_MS = 4000
const SIGNED_URL_EXPIRES_IN = 1800

export function useScanDetail(resultId: string) {
  return useQuery({
    queryKey: RESULT_KEY(resultId),
    queryFn: async () => {
      const { data } = await httpClient.get<ApiResult>(`/results/${resultId}`)
      return data
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'pending' || status === 'processing'
        ? PROCESSING_REFETCH_MS
        : false
    },
  })
}

export function useScanImage(resultId: string, variant: ResultImageVariant) {
  return useQuery({
    queryKey: IMAGE_KEY(resultId, variant),
    queryFn: async () => {
      const { data } = await httpClient.get<ApiResultImageSignedUrl>(
        `/results/${resultId}/image`,
        { params: { variant, expires_in: SIGNED_URL_EXPIRES_IN } },
      )
      return data
    },
    staleTime: (SIGNED_URL_EXPIRES_IN - 120) * 1000,
    retry: false,
  })
}

export function useCorrectionHistory(resultId: string) {
  return useQuery({
    queryKey: HISTORY_KEY(resultId),
    queryFn: async () => {
      const { data } = await httpClient.get<ApiCorrectionHistoryResponse>(
        `/results/${resultId}/corrections`,
      )
      return data
    },
  })
}

export function useApplyGrainCorrections(resultId: string) {
  const queryClient = useQueryClient()
  return useMutation<ApiResult, AxiosError, ApiGrainCorrectionRequest>({
    mutationFn: async (body) => {
      const { data } = await httpClient.patch<ApiResult>(
        `/results/${resultId}/grains`,
        body,
      )
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(RESULT_KEY(resultId), data)
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY(resultId) })
      queryClient.invalidateQueries({
        queryKey: IMAGE_KEY(resultId, 'annotated'),
      })
      queryClient.invalidateQueries({
        queryKey: IMAGE_KEY(resultId, 'annotated_ir'),
      })
    },
  })
}

export function useOverrideGrade(resultId: string) {
  const queryClient = useQueryClient()
  return useMutation<ApiResult, AxiosError, ApiGradeOverrideRequest>({
    mutationFn: async (body) => {
      const { data } = await httpClient.post<ApiResult>(
        `/results/${resultId}/grade-override`,
        body,
      )
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(RESULT_KEY(resultId), data)
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY(resultId) })
    },
  })
}
