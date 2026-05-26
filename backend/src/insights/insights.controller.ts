import { Request, Response, NextFunction } from 'express';
import { InsightsService } from './insights.service';

export class InsightsController {
  constructor(private readonly service: InsightsService) {}

  getSummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getSummary();
      res.json({
        headcount:    data.totalActiveEmployees,
        totalPayroll: data.totalAnnualPayroll,
        avgSalary:    data.averageSalary,
      });
    } catch (err) { next(err); }
  };

  getByCountry = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.service.getByCountry());
    } catch (err) { next(err); }
  };

  getByJobTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.service.getByJobTitle(req.query.country as string | undefined));
    } catch (err) { next(err); }
  };

  getByDepartment = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.service.getByDepartment());
    } catch (err) { next(err); }
  };

  getBySeniority = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.service.getBySeniority());
    } catch (err) { next(err); }
  };

  getTopEarners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const n       = req.query.n ? Number(req.query.n) : 10;
      const country = req.query.country as string | undefined;
      res.json(await this.service.getTopEarners(n, country));
    } catch (err) { next(err); }
  };

  getDistribution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bucketSize = req.query.bucketSize ? Number(req.query.bucketSize) : 10000;
      const country    = req.query.country as string | undefined;
      res.json(await this.service.getDistribution(bucketSize, country));
    } catch (err) { next(err); }
  };
}
