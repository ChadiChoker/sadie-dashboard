import axios from 'axios'
import type { CallSession, CallDetail } from '../types'

const SECRET = 'test-secret'

const api = axios.create({
  headers: {
    'x-sadie-core-secret': SECRET,
  }
})

export const fetchCalls = async (): Promise<CallSession[]> => {
  const res = await api.get('/beta/api/calls')
  return res.data
}

export const fetchCallDetail = async (callId: string): Promise<CallDetail> => {
  const res = await api.get(`/beta/api/calls/${callId}`)
  return res.data
}
