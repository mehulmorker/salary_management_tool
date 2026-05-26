interface DeleteConfirmDialogProps {
  name:      string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function DeleteConfirmDialog({ name, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, padding: 32, maxWidth: 400, width: '90%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}>
        <h3 style={{ margin: '0 0 12px' }}>Delete Employee</h3>
        <p style={{ margin: '0 0 24px', color: '#475569' }}>
          Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancel}  style={{ padding: '8px 16px' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4 }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
