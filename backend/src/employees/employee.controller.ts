import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';

export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.listEmployees({
        search:         req.query.search as string,
        country:        req.query.country as string,
        department:     req.query.department as string,
        seniorityLevel: req.query.seniorityLevel as never,
        sortBy:         req.query.sortBy as never,
        sortOrder:      req.query.sortOrder as never,
        page:           req.query.page  ? Number(req.query.page)  : undefined,
        limit:          req.query.limit ? Number(req.query.limit) : undefined
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await this.service.getEmployeeById(Number(req.params.id));
      res.json(employee);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await this.service.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await this.service.updateEmployee(Number(req.params.id), req.body);
      res.json(employee);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await this.service.deleteEmployee(Number(req.params.id));
      res.json(employee);
    } catch (err) {
      next(err);
    }
  };
}
