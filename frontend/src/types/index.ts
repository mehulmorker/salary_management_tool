// ── Employee ──────────────────────────────────────────────────────────────────

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
export type SeniorityLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXEC';

export interface Employee {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  country: string;
  countryCode: string;
  salary: number;
  currency: string;
  employmentType: EmploymentType;
  seniorityLevel: SeniorityLevel;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  country: string;
  countryCode: string;
  salary: number;
  currency?: string;
  employmentType?: EmploymentType;
  seniorityLevel?: SeniorityLevel;
  hireDate?: string;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Employee query params ─────────────────────────────────────────────────────

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  department?: string;
  seniorityLevel?: SeniorityLevel;
  sortBy?: 'salary' | 'fullName' | 'hireDate';
  sortOrder?: 'asc' | 'desc';
}

// ── Insights ──────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalActiveEmployees: number;
  totalAnnualPayroll: number;
  averageSalary: number;
}

export interface CountrySalaryStats {
  country: string;
  countryCode: string;
  headcount: number;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  medianSalary: number;
  totalPayroll: number;
}

export interface JobTitleStats {
  jobTitle: string;
  country: string;
  headcount: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
}

export interface DepartmentStats {
  department: string;
  headcount: number;
  avgSalary: number;
  totalPayroll: number;
  payrollShare: number;
}

export interface SeniorityStats {
  seniorityLevel: SeniorityLevel;
  headcount: number;
  avgSalary: number;
}

export interface SalaryBucket {
  rangeStart: number;
  rangeEnd: number;
  count: number;
}

export interface TopEarner {
  id: number;
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  seniorityLevel: SeniorityLevel;
}
