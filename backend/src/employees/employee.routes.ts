import { Router } from 'express';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEmployeeRouter(prisma: any): Router {
  const router = Router();
  const repository = new EmployeeRepository(prisma);
  const service    = new EmployeeService(repository);
  const controller = new EmployeeController(service);

  router.get('/',       controller.list);
  router.post('/',      controller.create);
  router.get('/:id',    controller.getById);
  router.put('/:id',    controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
