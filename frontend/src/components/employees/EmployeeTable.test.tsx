import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeTable } from './EmployeeTable';
import type { Employee } from '../../types';

const makeEmployee = (overrides: Partial<Employee> = {}): Employee => ({
  id: 1,
  fullName: 'Jane Smith',
  firstName: 'Jane',
  lastName: 'Smith',
  jobTitle: 'Software Engineer',
  department: 'Engineering',
  country: 'India',
  countryCode: 'IN',
  salary: 85000,
  currency: 'USD',
  employmentType: 'FULL_TIME',
  seniorityLevel: 'MID',
  hireDate: '2022-01-01T00:00:00.000Z',
  isActive: true,
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

describe('EmployeeTable', () => {
  it('renders employee rows', () => {
    const employees = [
      makeEmployee({ id: 1, fullName: 'Jane Smith' }),
      makeEmployee({ id: 2, fullName: 'John Doe', firstName: 'John', lastName: 'Doe' }),
    ];
    render(<EmployeeTable employees={employees} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit with the employee when Edit is clicked', () => {
    const onEdit = vi.fn();
    const employee = makeEmployee();
    render(<EmployeeTable employees={[employee]} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(employee);
  });

  it('calls onDelete with employee id when Delete is clicked', () => {
    const onDelete = vi.fn();
    const employee = makeEmployee({ id: 42 });
    render(<EmployeeTable employees={[employee]} onEdit={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it('shows empty state when no employees', () => {
    render(<EmployeeTable employees={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no employees/i)).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<EmployeeTable employees={[]} onEdit={vi.fn()} onDelete={vi.fn()} isLoading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
