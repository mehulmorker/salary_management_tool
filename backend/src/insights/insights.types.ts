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
    seniorityLevel: string;
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
    seniorityLevel: string;
  }