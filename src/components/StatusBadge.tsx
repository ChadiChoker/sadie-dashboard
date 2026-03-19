interface Props {
  status: 'IN_PROGRESS' | 'COMPLETED'
}

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, React.CSSProperties> = {
    IN_PROGRESS: { background: '#FFF3CD', color: '#856404', border: '1px solid #FFECB5' },
    COMPLETED:   { background: '#D1E7DD', color: '#0A3622', border: '1px solid #BADBCC' },
  }

  return (
    <span style={{
      ...styles[status],
      padding: '3px 10px',
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '12px',
      whiteSpace: 'nowrap',
    }}>
      {status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'COMPLETED'}
    </span>
  )
}
