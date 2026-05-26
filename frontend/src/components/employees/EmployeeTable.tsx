import type { Employee } from '../../types';

interface EmployeeTableProps {
  employees:  Employee[];
  onEdit:     (employee: Employee) => void;
  onDelete:   (id: number) => void;
  isLoading?: boolean;
}

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const th: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 13,
  color: '#475569',
  background: '#f8fafc',
  borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 14,
  color: '#1e293b',
  borderBottom: '1px solid #f1f5f9',
};

const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 500,
};

const seniorityColor: Record<string, React.CSSProperties> = {
  JUNIOR: { background: '#dcfce7', color: '#166534' },
  MID:    { background: '#dbeafe', color: '#1e40af' },
  SENIOR: { background: '#fef3c7', color: '#92400e' },
  LEAD:   { background: '#fce7f3', color: '#9d174d' },
  EXEC:   { background: '#f3e8ff', color: '#6b21a8' },
};

export function EmployeeTable({ employees, onEdit, onDelete, isLoading }: EmployeeTableProps) {
  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        <p style={{ margin: 0, fontSize: 15 }}>Loading employees…</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
        <p style={{ margin: 0, fontSize: 24 }}>👥</p>
        <p style={{ margin: '8px 0 0', fontSize: 15 }}>No employees found.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Job Title</th>
            <th style={th}>Department</th>
            <th style={th}>Country</th>
            <th style={th}>Seniority</th>
            <th style={{ ...th, textAlign: 'right' }}>Salary</th>
            <th style={{ ...th, textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <td style={{ ...td, fontWeight: 600 }}>{emp.fullName}</td>
              <td style={{ ...td, color: '#475569' }}>{emp.jobTitle}</td>
              <td style={td}>{emp.department}</td>
              <td style={td}>{emp.country}</td>
              <td style={td}>
                <span style={{ ...badge, ...(seniorityColor[emp.seniorityLevel] ?? {}) }}>
                  {emp.seniorityLevel}
                </span>
              </td>
              <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: '#0ea5e9' }}>
                {fmt.format(emp.salary)}
              </td>
              <td style={{ ...td, textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onEdit(emp)}
                    style={{
                      padding: '5px 14px', fontSize: 13, fontWeight: 500,
                      border: '1px solid #0ea5e9', borderRadius: 6,
                      background: '#fff', color: '#0ea5e9', cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(emp.id)}
                    style={{
                      padding: '5px 14px', fontSize: 13, fontWeight: 500,
                      border: '1px solid #ef4444', borderRadius: 6,
                      background: '#fff', color: '#ef4444', cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
