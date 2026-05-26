interface PaginationProps {
  page:       number;
  totalPages: number;
  onPage:     (page: number) => void;
}

const btn = (disabled: boolean): React.CSSProperties => ({
  padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
  border: '1px solid #e2e8f0', borderRadius: 6, background: disabled ? '#f8fafc' : '#fff',
  color: disabled ? '#94a3b8' : '#0ea5e9',
});

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button style={btn(page <= 1)} onClick={() => onPage(page - 1)} disabled={page <= 1}>← Prev</button>
      <span style={{ fontSize: 13, color: '#475569', padding: '0 4px' }}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button style={btn(page >= totalPages)} onClick={() => onPage(page + 1)} disabled={page >= totalPages}>Next →</button>
    </div>
  );
}
