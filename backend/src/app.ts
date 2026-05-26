import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './shared/errorHandler';

export function createApp(): express.Application {
  const app = express();

  // Security & parsing middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check — useful for deployment readiness probes
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes will be mounted here in later steps:
  // app.use('/api/v1/employees', employeeRoutes);
  // app.use('/api/v1/insights', insightRoutes);

  // Global error handler — must be last
  app.use(errorHandler);

  return app;
}
