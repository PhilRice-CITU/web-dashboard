import { useMutation } from '@tanstack/react-query'
import { createTestSession, submitTestSession } from '../api'
import type { SessionMetadata, UploadPair } from '../types'

type SubmitArgs = {
  deviceId: string
  meta: SessionMetadata
  pairs: UploadPair[]
}

type SubmitResult = {
  sessionId: string
  resultId: string
}

export function useSubmitTestSession() {
  return useMutation<SubmitResult, Error, SubmitArgs>({
    mutationFn: async ({ deviceId, meta, pairs }) => {
      const session = await createTestSession(deviceId, meta)
      const submitted = await submitTestSession(
        deviceId,
        session.id,
        pairs,
        meta,
      )
      const resultId = submitted.result_ids[0]
      if (!resultId) {
        throw new Error('Server did not return a result_id')
      }
      return { sessionId: session.id, resultId }
    },
  })
}
