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
  countryCode:    z.string().length(2, 'Country code must be 2 characters'),
  salary:         z.number({ invalid_type_error: 'Salary is required' }).positive('Salary must be positive'),
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
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="text" {...register('firstName')} />
        {errors.firstName && <span role="alert">{errors.firstName.message}</span>}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" type="text" {...register('lastName')} />
        {errors.lastName && <span role="alert">{errors.lastName.message}</span>}
      </div>

      <div>
        <label htmlFor="jobTitle">Job Title</label>
        <input id="jobTitle" type="text" {...register('jobTitle')} />
        {errors.jobTitle && <span role="alert">{errors.jobTitle.message}</span>}
      </div>

      <div>
        <label htmlFor="department">Department</label>
        <input id="department" type="text" {...register('department')} />
        {errors.department && <span role="alert">{errors.department.message}</span>}
      </div>

      <div>
        <label htmlFor="country">Country</label>
        <input id="country" type="text" {...register('country')} />
        {errors.country && <span role="alert">{errors.country.message}</span>}
      </div>

      <div>
        <label htmlFor="countryCode">Country Code</label>
        <input id="countryCode" type="text" maxLength={2} {...register('countryCode')} />
        {errors.countryCode && <span role="alert">{errors.countryCode.message}</span>}
      </div>

      <div>
        <label htmlFor="salary">Salary</label>
        <input
          id="salary"
          type="number"
          {...register('salary', { valueAsNumber: true })}
        />
        {errors.salary && <span role="alert">{errors.salary.message}</span>}
      </div>

      <div>
        <label htmlFor="seniorityLevel">Seniority Level</label>
        <select id="seniorityLevel" {...register('seniorityLevel')}>
          <option value="JUNIOR">Junior</option>
          <option value="MID">Mid</option>
          <option value="SENIOR">Senior</option>
          <option value="LEAD">Lead</option>
          <option value="EXEC">Exec</option>
        </select>
      </div>

      <div>
        <label htmlFor="employmentType">Employment Type</label>
        <select id="employmentType" {...register('employmentType')}>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
