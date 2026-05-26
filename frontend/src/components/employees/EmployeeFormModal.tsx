import { EmployeeForm } from './EmployeeForm';
import type { Employee, CreateEmployeePayload } from '../../types';

interface EmployeeFormModalProps {
  defaultValues?: Employee;
  isLoading?:     boolean;
  onSubmit:       (payload: CreateEmployeePayload) => void;
  onClose:        () => void;
}

export function EmployeeFormModal({ defaultValues, isLoading, onSubmit, onClose }: EmployeeFormModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      overflowY: 'auto', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, padding: 32, maxWidth: 560, width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>{defaultValues ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        <EmployeeForm
          defaultValues={defaultValues}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
