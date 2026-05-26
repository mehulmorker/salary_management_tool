export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT_TYPE";
export type SeniorityLevel = "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "EXEC";

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
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFilters {
  search?: string;
  country?: string;
  department?: string;
  seniorityLevel?: SeniorityLevel;
  sortBy?: "salary" | "fullName" | "hireDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedEmployees {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
