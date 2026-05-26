import { IInsightsRepository } from './insights.repository.interface';
import {
  CountrySalaryStats,
  DashboardSummary,
  DepartmentStats,
  JobTitleStats,
  SalaryBucket,
  SeniorityStats,
  TopEarner
} from './insights.types';

export class InsightsService {
  constructor(private readonly repository: IInsightsRepository) {}

  async getSummary(): Promise<DashboardSummary> {
    return this.repository.getSummary();
  }

  async getByCountry(): Promise<CountrySalaryStats[]> {
    const stats = await this.repository.getByCountry();
    return stats.sort((a, b) => b.headcount - a.headcount);
  }

  async getByJobTitle(country?: string): Promise<JobTitleStats[]> {
    return this.repository.getByJobTitle(country);
  }

  async getByDepartment(): Promise<DepartmentStats[]> {
    const stats = await this.repository.getByDepartment();
    const totalPayroll = stats.reduce((sum, d) => sum + d.totalPayroll, 0);
    return stats.map((d) => ({
      ...d,
      payrollShare: totalPayroll > 0
        ? parseFloat(((d.totalPayroll / totalPayroll) * 100).toFixed(2))
        : 0
    }));
  }

  async getBySeniority(): Promise<SeniorityStats[]> {
    return this.repository.getBySeniority();
  }

  async getTopEarners(n: number, country?: string): Promise<TopEarner[]> {
    return this.repository.getTopEarners(n, country);
  }

  async getDistribution(bucketSize: number, country?: string): Promise<SalaryBucket[]> {
    const salaries = await this.repository.getAllSalaries(country);
    return this.computeDistribution(salaries, bucketSize);
  }

  computeDistribution(salaries: number[], bucketSize: number): SalaryBucket[] {
    if (salaries.length === 0) return [];

    const min = Math.floor(Math.min(...salaries) / bucketSize) * bucketSize;
    const max = Math.floor(Math.max(...salaries) / bucketSize) * bucketSize;

    const buckets: SalaryBucket[] = [];
    for (let start = min; start <= max; start += bucketSize) {
      buckets.push({
        rangeStart: start,
        rangeEnd: start + bucketSize,
        count: salaries.filter(s => s >= start && s < start + bucketSize).length
      });
    }
    return buckets;
  }
}
