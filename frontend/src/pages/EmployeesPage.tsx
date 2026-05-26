import { useState } from 'react';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { DeleteConfirmDialog } from '../components/shared/DeleteConfirmDialog';
import { Pagination } from '../components/shared/Pagination';
import {
  useEmployeeList,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from '../hooks/useEmployees';
import type { Employee, CreateEmployeePayload } from '../types';

const LIMIT = 20;

export function EmployeesPage() {
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [country,    setCountry]    = useState('');
  const [department, setDepartment] = useState('');
  const [modalEmployee, setModalEmployee] = useState<Employee | null | 'new'>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<Employee | null>(null);

  const { data, isLoading, isError } = useEmployeeList({ page, limit: LIMIT, search: search || undefined, country: country || undefined, department: department || undefined });
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const handleSubmit = (payload: CreateEmployeePayload) => {
    if (modalEmployee === 'new') {
      createMutation.mutate(payload, { onSuccess: () => setModalEmployee(null) });
    } else if (modalEmployee) {
      updateMutation.mutate(
        { id: modalEmployee.id, data: payload },
        { onSuccess: () => setModalEmployee(null) }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Employees</h1>
        <button
          onClick={() => setModalEmployee('new')}
          style={{ padding: '10px 20px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
        >
          + Add Employee
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, flex: '1 1 200px' }}
        />
        <input
          type="text"
          placeholder="Filter by country…"
          value={country}
          onChange={e => { setCountry(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, flex: '1 1 160px' }}
        />
        <input
          type="text"
          placeholder="Filter by department…"
          value={department}
          onChange={e => { setDepartment(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, flex: '1 1 160px' }}
        />
      </div>

      {/* Error */}
      {isError && <p style={{ color: '#ef4444' }}>Failed to load employees.</p>}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <EmployeeTable
          employees={data?.data ?? []}
          isLoading={isLoading}
          onEdit={emp => setModalEmployee(emp)}
          onDelete={id => {
            const emp = data?.data.find(e => e.id === id);
            if (emp) setDeleteTarget(emp);
          }}
        />
      </div>

      {/* Pagination */}
      {data && (
        <Pagination page={page} totalPages={data.meta.totalPages} onPage={setPage} />
      )}

      {/* Add / Edit modal */}
      {modalEmployee !== null && (
        <EmployeeFormModal
          defaultValues={modalEmployee === 'new' ? undefined : modalEmployee}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
          onClose={() => setModalEmployee(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteConfirmDialog
          name={deleteTarget.fullName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
