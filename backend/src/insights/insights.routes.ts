import { Router } from 'express';
import { InsightsRepository } from './insights.repository';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createInsightsRouter(prisma: any): Router {
  const router     = Router();
  const repository = new InsightsRepository(prisma);
  const service    = new InsightsService(repository);
  const controller = new InsightsController(service);

  router.get('/summary',       controller.getSummary);
  router.get('/by-country',    controller.getByCountry);
  router.get('/by-job-title',  controller.getByJobTitle);
  router.get('/by-department', controller.getByDepartment);
  router.get('/by-seniority',  controller.getBySeniority);
  router.get('/top-earners',   controller.getTopEarners);
  router.get('/distribution',  controller.getDistribution);

  return router;
}
