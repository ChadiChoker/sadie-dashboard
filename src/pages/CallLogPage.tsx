import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCalls } from '../api/callsApi'
import StatusBadge from '../components/StatusBadge'
import type { CallSession } from '../types'

function formatDuration(seconds: number | null): string {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}m ${s}s`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString()
}

export default function CallLogPage() {
  const [calls, setCalls] = useState<CallSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCalls()
      .then(setCalls)
      .catch(() => setError('Failed to load calls'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={styles.center}>Loading...</div>
  if (error)   return <div style={styles.center}>{error}</div>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>SADIE — Call Activity Dashboard</h1>

      {calls.length === 0 ? (
        <div style={styles.empty}>No calls yet. Send a webhook to get started.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {['Status', 'Category', 'Customer', 'Duration', 'Started'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calls.map(call => (
              <tr
                key={call.id}
                style={styles.row}
                onClick={() => navigate(`/calls/${call.callId}`)}
              >
                <td style={styles.td}><StatusBadge status={call.status} /></td>
                <td style={styles.td}>{call.category ?? '—'}</td>
                <td style={styles.td}>{call.customerNumber ?? '—'}</td>
                <td style={styles.td}>{formatDuration(call.durationSeconds)}</td>
                <td style={styles.td}>{formatDate(call.startedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page:  { maxWidth: 900, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#1a1a1a' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  th:    { textAlign: 'left', padding: '12px 16px', background: '#f8f9fa', fontSize: 13, fontWeight: 600, color: '#555', borderBottom: '1px solid #e9ecef' },
  td:    { padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #f0f0f0', color: '#333' },
  row:   { cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 60, color: '#999', fontSize: 15 },
  center:{ textAlign: 'center', padding: 60, color: '#999' },
}
