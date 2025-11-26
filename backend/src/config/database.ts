import mongoose from "mongoose";
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        logger.info(`MongoDb Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async () : Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('Database Disconnected');
    } catch (error) {
        logger.error('Error disconnecting database:', error);
        process.exit(1);
    }
};