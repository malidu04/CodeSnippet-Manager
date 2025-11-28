import dotenv from 'dotenv';
dotenv.config(); // <-- This loads variables from .env

import app from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try { 
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
