import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, unknown>;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', err);

  // Mongoose bad ObjectId
  if (err instanceof mongoose.Error.CastError) {
    const message = 'Resource not found';
    error = { name: 'CastError', message, statusCode: 404 } as CustomError;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const message = `${field} already exists`;
    error = { name: 'DuplicateField', message, statusCode: 400 } as CustomError;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `Validation failed: ${messages.join(', ')}`;
    error = { name: 'ValidationError', message, statusCode: 400 } as CustomError;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { name: 'JsonWebTokenError', message, statusCode: 401 } as CustomError;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { name: 'TokenExpiredError', message, statusCode: 401 } as CustomError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};