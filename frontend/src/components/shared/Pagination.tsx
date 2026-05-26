interface PaginationProps {
  page:       number;
  totalPages: number;
  onPage:     (page: number) => void;
}

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16 }}>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}>← Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}>Next →</button>
    </div>
  );
}
