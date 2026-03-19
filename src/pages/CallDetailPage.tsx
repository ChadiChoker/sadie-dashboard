import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCallDetail } from '../api/callsApi'
import StatusBadge from '../components/StatusBadge'
import type { CallDetail } from '../types'

export default function CallDetailPage() {
  const { callId } = useParams<{ callId: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<CallDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!callId) return
    fetchCallDetail(callId)
      .then(setDetail)
      .catch(() => setError('Failed to load call detail'))
      .finally(() => setLoading(false))
  }, [callId])

  if (loading) return <div style={styles.center}>Loading...</div>
  if (error || !detail) return <div style={styles.center}>{error ?? 'Not found'}</div>

  return (
    <div style={styles.page}>
      <button onClick={() => navigate('/')} style={styles.back}>← Back to calls</button>

      {/* Session Summary */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Session Summary</h2>
        <div style={styles.grid}>
          <div><span style={styles.label}>Status</span><br /><StatusBadge status={detail.status} /></div>
          <div><span style={styles.label}>Category</span><br /><span style={styles.value}>{detail.category ?? '—'}</span></div>
          <div><span style={styles.label}>Customer</span><br /><span style={styles.value}>{detail.customerNumber ?? '—'}</span></div>
          <div><span style={styles.label}>Duration</span><br /><span style={styles.value}>{detail.durationSeconds ? `${Math.floor(detail.durationSeconds / 60)}m ${Math.floor(detail.durationSeconds % 60)}s` : '—'}</span></div>
          <div><span style={styles.label}>Ended Reason</span><br /><span style={styles.value}>{detail.endedReason ?? '—'}</span></div>
          <div><span style={styles.label}>Recording</span><br />{detail.recordingUrl ? <a href={detail.recordingUrl} target="_blank" rel="noreferrer" style={styles.link}>Listen</a> : <span style={styles.value}>—</span>}</div>
        </div>
        {detail.summary && (
          <div style={{ marginTop: 16 }}>
            <span style={styles.label}>Summary</span>
            <p style={styles.summary}>{detail.summary}</p>
          </div>
        )}
      </div>

      {/* Transcript */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Transcript</h2>
        {detail.messages.length === 0 ? (
          <p style={styles.empty}>No messages recorded.</p>
        ) : (
          <div style={styles.chat}>
            {detail.messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div style={{
                  ...styles.bubble,
                  background: msg.role === 'user' ? '#0d6efd' : '#f0f0f0',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                }}>
                  <div style={styles.roleLabel}>{msg.role === 'bot' ? 'AI' : 'Customer'}</div>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tool Call Audit Log */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Tool Call Audit Log</h2>
        {detail.toolLogs.length === 0 ? (
          <p style={styles.empty}>No tool calls recorded.</p>
        ) : (
          detail.toolLogs.map(log => (
            <details key={log.id} style={styles.accordion}>
              <summary style={styles.accordionSummary}>
                <span style={styles.toolName}>{log.toolName}</span>
                <span style={styles.toolTime}>{new Date(log.createdAt).toLocaleTimeString()}</span>
              </summary>
              <div style={styles.accordionBody}>
                <div style={styles.jsonBlock}>
                  <div style={styles.jsonLabel}>Request</div>
                  <pre style={styles.pre}>{JSON.stringify(log.requestJson, null, 2)}</pre>
                </div>
                <div style={styles.jsonBlock}>
                  <div style={styles.jsonLabel}>Response</div>
                  <pre style={styles.pre}>{JSON.stringify(log.responseJson, null, 2)}</pre>
                </div>
              </div>
            </details>
          ))
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page:           { maxWidth: 900, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
  back:           { background: 'none', border: 'none', color: '#0d6efd', cursor: 'pointer', fontSize: 14, marginBottom: 20, padding: 0 },
  card:           { background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', padding: 24, marginBottom: 20 },
  cardTitle:      { fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16, color: '#1a1a1a' },
  grid:           { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  label:          { fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  value:          { fontSize: 14, color: '#333', marginTop: 4, display: 'block' },
  summary:        { fontSize: 14, color: '#555', margin: '4px 0 0', lineHeight: 1.5 },
  link:           { fontSize: 14, color: '#0d6efd' },
  chat:           { display: 'flex', flexDirection: 'column' as const, gap: 4 },
  bubble:         { maxWidth: '70%', padding: '10px 14px', fontSize: 14, lineHeight: 1.5 },
  roleLabel:      { fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.7 },
  accordion:      { border: '1px solid #e9ecef', borderRadius: 6, marginBottom: 8, overflow: 'hidden' },
  accordionSummary: { padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', listStyle: 'none' },
  toolName:       { fontWeight: 600, fontSize: 14, color: '#333' },
  toolTime:       { fontSize: 12, color: '#888' },
  accordionBody:  { padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  jsonBlock:      { overflow: 'hidden' },
  jsonLabel:      { fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase' as const, marginBottom: 6 },
  pre:            { background: '#f8f9fa', padding: 12, borderRadius: 4, fontSize: 12, overflow: 'auto', margin: 0, maxHeight: 300 },
  empty:          { color: '#999', fontSize: 14, margin: 0 },
  center:         { textAlign: 'center', padding: 60, color: '#999' },
}
