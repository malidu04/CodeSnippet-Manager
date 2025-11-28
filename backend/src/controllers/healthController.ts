import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
    };

    res.status(200).json({
      success: true,
      data: healthInfo,
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
    });
  }
};