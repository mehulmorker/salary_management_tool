import { InsightsService } from '@/insights/insights.service';
import { IInsightsRepository } from '@/insights/insights.repository.interface';
import {
  CountrySalaryStats,
  DepartmentStats,
  JobTitleStats,
  SeniorityStats,
  TopEarner,
  DashboardSummary
} from '@/insights/insights.types';

const mockRepo: jest.Mocked<IInsightsRepository> = {
  getSummary:      jest.fn(),
  getByCountry:    jest.fn(),
  getByJobTitle:   jest.fn(),
  getByDepartment: jest.fn(),
  getBySeniority:  jest.fn(),
  getTopEarners:   jest.fn(),
  getAllSalaries:   jest.fn()
};

describe('InsightsService', () => {
  let service: InsightsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InsightsService(mockRepo);
  });

  describe('getSummary', () => {
    it('returns summary from repository', async () => {
      const summary: DashboardSummary = {
        totalActiveEmployees: 100,
        totalAnnualPayroll: 5000000,
        averageSalary: 50000
      };
      mockRepo.getSummary.mockResolvedValue(summary);
      const result = await service.getSummary();
      expect(result).toEqual(summary);
    });
  });

  describe('getByCountry', () => {
    it('returns stats sorted by headcount descending', async () => {
      const stats: CountrySalaryStats[] = [
        { country: 'India', countryCode: 'IN', headcount: 50, minSalary: 30000, maxSalary: 120000, avgSalary: 70000,  medianSalary: 68000,  totalPayroll: 3500000 },
        { country: 'USA',   countryCode: 'US', headcount: 80, minSalary: 60000, maxSalary: 200000, avgSalary: 120000, medianSalary: 115000, totalPayroll: 9600000 }
      ];
      mockRepo.getByCountry.mockResolvedValue(stats);
      const result = await service.getByCountry();
      expect(result[0].country).toBe('USA');
      expect(result[1].country).toBe('India');
    });
  });

  describe('getByJobTitle', () => {
    it('passes country filter to repository', async () => {
      const stats: JobTitleStats[] = [
        { jobTitle: 'Engineer', country: 'India', headcount: 10, avgSalary: 80000, minSalary: 60000, maxSalary: 100000 }
      ];
      mockRepo.getByJobTitle.mockResolvedValue(stats);
      await service.getByJobTitle('India');
      expect(mockRepo.getByJobTitle).toHaveBeenCalledWith('India');
    });
  });

  describe('getByDepartment', () => {
    it('adds payrollShare percentage to each department', async () => {
      const stats: DepartmentStats[] = [
        { department: 'Engineering', headcount: 40, avgSalary: 90000, totalPayroll: 3600000, payrollShare: 0 },
        { department: 'HR',          headcount: 10, avgSalary: 60000, totalPayroll: 600000,  payrollShare: 0 }
      ];
      mockRepo.getByDepartment.mockResolvedValue(stats);
      const result = await service.getByDepartment();
      expect(result[0].payrollShare).toBeCloseTo(85.71, 1);
      expect(result[1].payrollShare).toBeCloseTo(14.29, 1);
    });
  });

  describe('getBySeniority', () => {
    it('returns seniority stats from repository', async () => {
      const stats: SeniorityStats[] = [
        { seniorityLevel: 'SENIOR', headcount: 20, avgSalary: 100000 }
      ];
      mockRepo.getBySeniority.mockResolvedValue(stats);
      const result = await service.getBySeniority();
      expect(result).toEqual(stats);
    });
  });

  describe('getTopEarners', () => {
    it('returns exactly N earners sorted by salary desc', async () => {
      const earners: TopEarner[] = [
        { id: 1, fullName: 'Alice', jobTitle: 'CTO', department: 'Tech', country: 'USA', salary: 200000, seniorityLevel: 'EXEC' },
        { id: 2, fullName: 'Bob',   jobTitle: 'VP',  department: 'Tech', country: 'USA', salary: 180000, seniorityLevel: 'LEAD' }
      ];
      mockRepo.getTopEarners.mockResolvedValue(earners);
      const result = await service.getTopEarners(2);
      expect(result).toHaveLength(2);
      expect(result[0].salary).toBeGreaterThanOrEqual(result[1].salary);
    });
  });

  describe('computeDistribution', () => {
    it('buckets salaries into correct ranges', () => {
      const salaries = [25000, 35000, 45000, 55000, 65000];
      const buckets = service.computeDistribution(salaries, 20000);
      const bucket20 = buckets.find(b => b.rangeStart === 20000);
      const bucket40 = buckets.find(b => b.rangeStart === 40000);
      expect(bucket20?.count).toBe(2); // 25000, 35000
      expect(bucket40?.count).toBe(2); // 45000, 55000
    });

    it('returns empty array for empty salary list', () => {
      expect(service.computeDistribution([], 10000)).toEqual([]);
    });
  });
});
