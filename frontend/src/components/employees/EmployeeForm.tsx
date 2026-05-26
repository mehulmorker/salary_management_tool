import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Employee, CreateEmployeePayload } from '../../types';

const schema = z.object({
  firstName:      z.string().min(1, 'First name is required'),
  lastName:       z.string().min(1, 'Last name is required'),
  jobTitle:       z.string().min(1, 'Job title is required'),
  department:     z.string().min(1, 'Department is required'),
  country:        z.string().min(1, 'Country is required'),
  countryCode:    z.string().length(2, 'Must be 2 characters (e.g. IN)'),
  salary:         z.number().positive('Salary must be positive'),
  seniorityLevel: z.enum(['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXEC']).optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']).optional(),
  hireDate:       z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EmployeeFormProps {
  onSubmit:      (payload: CreateEmployeePayload) => void;
  defaultValues?: Employee;
  isLoading?:    boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 14, boxSizing: 'border-box',
  border: '1px solid #cbd5e1', borderRadius: 6, outline: 'none',
  background: '#fff', color: '#1e293b',
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 4, fontSize: 13,
  fontWeight: 500, color: '#374151',
};

const fieldStyle: React.CSSProperties = { marginBottom: 16 };

const errorStyle: React.CSSProperties = {
  display: 'block', marginTop: 4, fontSize: 12, color: '#ef4444',
};

export function EmployeeForm({ onSubmit, defaultValues, isLoading }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          firstName:      defaultValues.firstName,
          lastName:       defaultValues.lastName,
          jobTitle:       defaultValues.jobTitle,
          department:     defaultValues.department,
          country:        defaultValues.country,
          countryCode:    defaultValues.countryCode,
          salary:         defaultValues.salary,
          seniorityLevel: defaultValues.seniorityLevel,
          employmentType: defaultValues.employmentType,
        }
      : {},
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values as CreateEmployeePayload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <div style={fieldStyle}>
          <label htmlFor="firstName" style={labelStyle}>First Name</label>
          <input id="firstName" type="text" style={inputStyle} {...register('firstName')} />
          {errors.firstName && <span role="alert" style={errorStyle}>{errors.firstName.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="lastName" style={labelStyle}>Last Name</label>
          <input id="lastName" type="text" style={inputStyle} {...register('lastName')} />
          {errors.lastName && <span role="alert" style={errorStyle}>{errors.lastName.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="jobTitle" style={labelStyle}>Job Title</label>
          <input id="jobTitle" type="text" style={inputStyle} {...register('jobTitle')} />
          {errors.jobTitle && <span role="alert" style={errorStyle}>{errors.jobTitle.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="department" style={labelStyle}>Department</label>
          <input id="department" type="text" style={inputStyle} {...register('department')} />
          {errors.department && <span role="alert" style={errorStyle}>{errors.department.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="country" style={labelStyle}>Country</label>
          <input id="country" type="text" style={inputStyle} {...register('country')} />
          {errors.country && <span role="alert" style={errorStyle}>{errors.country.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="countryCode" style={labelStyle}>Country Code</label>
          <input id="countryCode" type="text" maxLength={2} placeholder="e.g. IN" style={inputStyle} {...register('countryCode')} />
          {errors.countryCode && <span role="alert" style={errorStyle}>{errors.countryCode.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="salary" style={labelStyle}>Salary (USD)</label>
          <input id="salary" type="number" style={inputStyle} {...register('salary', { valueAsNumber: true })} />
          {errors.salary && <span role="alert" style={errorStyle}>{errors.salary.message}</span>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="seniorityLevel" style={labelStyle}>Seniority Level</label>
          <select id="seniorityLevel" style={{ ...inputStyle, background: '#fff' }} {...register('seniorityLevel')}>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead</option>
            <option value="EXEC">Exec</option>
          </select>
        </div>

        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <label htmlFor="employmentType" style={labelStyle}>Employment Type</label>
          <select id="employmentType" style={{ ...inputStyle, background: '#fff' }} {...register('employmentType')}>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%', padding: '11px 0', fontSize: 15, fontWeight: 600,
            border: 'none', borderRadius: 6, cursor: isLoading ? 'not-allowed' : 'pointer',
            background: isLoading ? '#94a3b8' : '#0ea5e9', color: '#fff',
          }}
        >
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
