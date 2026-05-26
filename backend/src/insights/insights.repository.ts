import { IInsightsRepository } from './insights.repository.interface';
import {
  CountrySalaryStats,
  DashboardSummary,
  DepartmentStats,
  JobTitleStats,
  SeniorityStats,
  TopEarner,
} from './insights.types';

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export class InsightsRepository implements IInsightsRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly prisma: any) {}

  async getSummary(): Promise<DashboardSummary> {
    const agg = await this.prisma.employee.aggregate({
      where: { isActive: true },
      _count: { id: true },
      _sum:   { salary: true },
      _avg:   { salary: true },
    });
    return {
      totalActiveEmployees: agg._count.id,
      totalAnnualPayroll:   agg._sum.salary  ?? 0,
      averageSalary:        agg._avg.salary  ?? 0,
    };
  }

  async getByCountry(): Promise<CountrySalaryStats[]> {
    const rows = await this.prisma.employee.findMany({
      where:  { isActive: true },
      select: { country: true, countryCode: true, salary: true },
    });

    const map = new Map<string, { country: string; countryCode: string; salaries: number[] }>();
    for (const r of rows) {
      if (!map.has(r.country)) {
        map.set(r.country, { country: r.country, countryCode: r.countryCode, salaries: [] });
      }
      map.get(r.country)!.salaries.push(r.salary);
    }

    return Array.from(map.values()).map(({ country, countryCode, salaries }) => {
      const sorted = [...salaries].sort((a, b) => a - b);
      const total  = salaries.reduce((s, v) => s + v, 0);
      return {
        country,
        countryCode,
        headcount:    salaries.length,
        minSalary:    sorted[0],
        maxSalary:    sorted[sorted.length - 1],
        avgSalary:    total / salaries.length,
        medianSalary: median(sorted),
        totalPayroll: total,
      };
    });
  }

  async getByJobTitle(country?: string): Promise<JobTitleStats[]> {
    const groups = await this.prisma.employee.groupBy({
      by:    ['jobTitle', 'country'],
      where: { isActive: true, ...(country && { country }) },
      _count: { id: true },
      _avg:   { salary: true },
      _min:   { salary: true },
      _max:   { salary: true },
    });

    return groups.map((g: {
      jobTitle: string;
      country: string;
      _count: { id: number };
      _avg: { salary: number };
      _min: { salary: number };
      _max: { salary: number };
    }) => ({
      jobTitle:  g.jobTitle,
      country:   g.country,
      headcount: g._count.id,
      avgSalary: g._avg.salary,
      minSalary: g._min.salary,
      maxSalary: g._max.salary,
    }));
  }

  async getByDepartment(): Promise<DepartmentStats[]> {
    const groups = await this.prisma.employee.groupBy({
      by:    ['department'],
      where: { isActive: true },
      _count: { id: true },
      _avg:   { salary: true },
      _sum:   { salary: true },
    });

    return groups.map((g: {
      department: string;
      _count: { id: number };
      _avg: { salary: number };
      _sum: { salary: number };
    }) => ({
      department:   g.department,
      headcount:    g._count.id,
      avgSalary:    g._avg.salary,
      totalPayroll: g._sum.salary,
      payrollShare: 0, // computed by service
    }));
  }

  async getBySeniority(): Promise<SeniorityStats[]> {
    const groups = await this.prisma.employee.groupBy({
      by:    ['seniorityLevel'],
      where: { isActive: true },
      _count: { id: true },
      _avg:   { salary: true },
    });

    return groups.map((g: {
      seniorityLevel: string;
      _count: { id: number };
      _avg: { salary: number };
    }) => ({
      seniorityLevel: g.seniorityLevel,
      headcount:      g._count.id,
      avgSalary:      g._avg.salary,
    }));
  }

  async getTopEarners(n: number, country?: string): Promise<TopEarner[]> {
    const rows = await this.prisma.employee.findMany({
      where:   { isActive: true, ...(country && { country }) },
      orderBy: { salary: 'desc' },
      take:    n,
      select:  {
        id: true, fullName: true, jobTitle: true,
        department: true, country: true, salary: true, seniorityLevel: true,
      },
    });
    return rows as unknown as TopEarner[];
  }

  async getAllSalaries(country?: string): Promise<number[]> {
    const rows = await this.prisma.employee.findMany({
      where:  { isActive: true, ...(country && { country }) },
      select: { salary: true },
    });
    return rows.map((r: { salary: number }) => r.salary);
  }
}
