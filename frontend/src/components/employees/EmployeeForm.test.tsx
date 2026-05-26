import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeForm } from './EmployeeForm';
import type { Employee } from '../../types';

const validPayload = {
  firstName:      'Jane',
  lastName:       'Smith',
  jobTitle:       'Software Engineer',
  department:     'Engineering',
  country:        'India',
  countryCode:    'IN',
  salary:         85000,
  seniorityLevel: 'MID'  as const,
  employmentType: 'FULL_TIME' as const,
};

describe('EmployeeForm', () => {
  it('renders all required fields', () => {
    render(<EmployeeForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^country$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
  });

  it('shows validation error when salary is empty on submit', async () => {
    render(<EmployeeForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await screen.findByText(/salary/i);
    // at least one error is shown
    expect(document.querySelector('[role="alert"], .error, [data-error]') ||
      screen.queryByText(/required|invalid|must/i)).toBeTruthy();
  });

  it('calls onSubmit with correct payload', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/first name/i), validPayload.firstName);
    await user.type(screen.getByLabelText(/last name/i),  validPayload.lastName);
    await user.type(screen.getByLabelText(/job title/i),  validPayload.jobTitle);
    await user.type(screen.getByLabelText(/department/i), validPayload.department);
    await user.type(screen.getByLabelText(/^country$/i),  validPayload.country);
    await user.type(screen.getByLabelText(/country code/i), validPayload.countryCode);
    await user.clear(screen.getByLabelText(/salary/i));
    await user.type(screen.getByLabelText(/salary/i),     String(validPayload.salary));

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const arg = onSubmit.mock.calls[0][0];
    expect(arg.firstName).toBe('Jane');
    expect(arg.salary).toBe(85000);
  });

  it('pre-fills fields when defaultValues provided', () => {
    const existing: Employee = {
      id: 1, fullName: 'Jane Smith', isActive: true,
      createdAt: '', updatedAt: '', hireDate: '',
      currency: 'USD',
      ...validPayload,
    };
    render(<EmployeeForm onSubmit={vi.fn()} defaultValues={existing} />);
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/salary/i)).toHaveValue(85000);
  });
});
