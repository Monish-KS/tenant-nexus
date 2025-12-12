import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ValidationError } from 'express-validator';

export const errorHandler = (
  err: Error | AppError | ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof Error && 'errors' in err) {
    const validationError = err as any;
    if (Array.isArray(validationError.errors)) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationError.errors.map((e: any) => ({
          field: e.path || e.param,
          message: e.msg || e.message,
        })),
      });
      return;
    }
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
};

