import type { Employee } from '../../types';

interface EmployeeTableProps {
  employees:  Employee[];
  onEdit:     (employee: Employee) => void;
  onDelete:   (id: number) => void;
  isLoading?: boolean;
}

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function EmployeeTable({ employees, onEdit, onDelete, isLoading }: EmployeeTableProps) {
  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (employees.length === 0) {
    return <p>No employees found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Job Title</th>
          <th>Department</th>
          <th>Country</th>
          <th>Salary</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.fullName}</td>
            <td>{emp.jobTitle}</td>
            <td>{emp.department}</td>
            <td>{emp.country}</td>
            <td>{fmt.format(emp.salary)}</td>
            <td>
              <button type="button" onClick={() => onEdit(emp)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(emp.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
