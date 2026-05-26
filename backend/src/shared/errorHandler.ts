import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    });
    return;
  }

  // Unknown error — do not leak internals in production
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
}
