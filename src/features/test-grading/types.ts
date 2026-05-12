export type UploadPair = {
  id: string
  raw: File | null
  ir: File | null
}

export type SessionMetadata = {
  operator_name: string
  session_name?: string
  rice_variety?: string
}

export type CreateSessionResponse = {
  id: string
  status: string
}

export type SubmitSessionResponse = {
  result_ids: string[]
}
