import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma as defaultPrisma } from './config/database';
import { errorHandler } from './shared/errorHandler';
import { createEmployeeRouter } from './employees/employee.routes';
import { createInsightsRouter } from './insights/insights.routes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createApp(prismaClient?: any): express.Application {
  const app    = express();
  const client = prismaClient ?? defaultPrisma;

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/employees', createEmployeeRouter(client));
  app.use('/api/v1/insights',  createInsightsRouter(client));

  app.use(errorHandler);

  return app;
}
