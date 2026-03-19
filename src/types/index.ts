export interface CallSession {
  id: string
  callId: string
  tenantId: string
  assistantId: string | null
  customerNumber: string | null
  dealershipNumber: string | null
  status: 'IN_PROGRESS' | 'COMPLETED'
  category: string | null
  endedReason: string | null
  durationSeconds: number | null
  startedAt: string | null
  endedAt: string | null
  createdAt: string
}

export interface CallMessage {
  id: string
  role: 'bot' | 'user'
  message: string
  secondsFromStart: number | null
  duration: number | null
}

export interface ToolCallLog {
  id: string
  toolName: string
  callId: string
  requestJson: Record<string, unknown>
  responseJson: Record<string, unknown>
  createdAt: string
}

export interface CallDetail extends CallSession {
  transcript: string | null
  summary: string | null
  recordingUrl: string | null
  messages: CallMessage[]
  toolLogs: ToolCallLog[]
}
