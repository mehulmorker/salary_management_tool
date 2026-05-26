import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./shared/errorHandler";
export function createApp(_prismaClient?: unknown): express.Application {
  const app = express();

  // Security & parsing middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check — useful for deployment readiness probes
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Routes will be mounted here in the next step:
  // const client = prismaClient ?? prisma;
  // app.use('/api/v1/employees', createEmployeeRouter(client));
  // app.use('/api/v1/insights', createInsightsRouter(client));

  // Global error handler — must be last
  app.use(errorHandler);

  return app;
}
