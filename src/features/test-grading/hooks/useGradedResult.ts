import {
  useScanDetail,
  useScanImage,
} from '#/features/scans/hooks/useScanDetail'

export function useGradedResult(resultId: string | null) {
  const detail = useScanDetail(resultId ?? '')
  const annotated = useScanImage(resultId ?? '', 'annotated')

  const status = detail.data?.status
  const isTerminal =
    !!status && ['graded', 'failed', 'corrected'].includes(status)

  return {
    result: resultId ? detail.data : undefined,
    annotatedUrl: resultId && isTerminal ? annotated.data?.signed_url : null,
    isLoading: !!resultId && detail.isLoading,
    isPolling: !!resultId && !isTerminal,
    error: detail.error ?? annotated.error,
  }
}
