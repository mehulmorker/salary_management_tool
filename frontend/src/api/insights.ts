import { apiClient } from './client';
import type {
  DashboardSummary,
  CountrySalaryStats,
  JobTitleStats,
  DepartmentStats,
  SeniorityStats,
  SalaryBucket,
  TopEarner,
} from '../types';

// Map backend snake-style keys → frontend camelCase types
export const insightsApi = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get('/insights/summary');
    return {
      totalActiveEmployees: data.headcount,
      totalAnnualPayroll:   data.totalPayroll,
      averageSalary:        data.avgSalary,
    };
  },

  getByCountry(): Promise<CountrySalaryStats[]> {
    return apiClient.get('/insights/by-country').then(r => r.data);
  },

  getByJobTitle(country?: string): Promise<JobTitleStats[]> {
    return apiClient.get('/insights/by-job-title', { params: { country } }).then(r => r.data);
  },

  getByDepartment(): Promise<DepartmentStats[]> {
    return apiClient.get('/insights/by-department').then(r => r.data);
  },

  getBySeniority(): Promise<SeniorityStats[]> {
    return apiClient.get('/insights/by-seniority').then(r => r.data);
  },

  getTopEarners(n = 10, country?: string): Promise<TopEarner[]> {
    return apiClient.get('/insights/top-earners', { params: { n, country } }).then(r => r.data);
  },

  getDistribution(bucketSize = 10000, country?: string): Promise<SalaryBucket[]> {
    return apiClient.get('/insights/distribution', { params: { bucketSize, country } }).then(r => r.data);
  },
};
