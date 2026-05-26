import {
  CountrySalaryStats,
  DashboardSummary,
  DepartmentStats,
  JobTitleStats,
  SeniorityStats,
  TopEarner,
} from "./insights.types";

export interface IInsightsRepository {
  getSummary(): Promise<DashboardSummary>;
  getByCountry(): Promise<CountrySalaryStats[]>;
  getByJobTitle(country?: string): Promise<JobTitleStats[]>;
  getByDepartment(): Promise<DepartmentStats[]>;
  getBySeniority(): Promise<SeniorityStats[]>;
  getTopEarners(n: number, country?: string): Promise<TopEarner[]>;
  getAllSalaries(country?: string): Promise<number[]>;
}
