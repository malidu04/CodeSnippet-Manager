import mongoose from 'mongoose';
import { logger } from './logger';

export const databaseUtils = {
  async connectDatabase(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      const conn = await mongoose.connect(mongoUri);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      logger.error('Database connection error:', error);
      process.exit(1);
    }
  },

  async disconnectDatabase(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting database:', error);
      process.exit(1);
    }
  },

  async clearDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('clearDatabase can only be used in test environment');
    }

    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      // Add null check for collection
      if (collection) {
        await collection.deleteMany({});
      }
    }
  },

  async dropDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('dropDatabase can only be used in test environment');
    }

    // Safe check for database existence
    const db = mongoose.connection.db;
    if (db) {
      await db.dropDatabase();
    } else {
      logger.warn('No database connection available to drop');
    }
  },

  getConnectionState(): string {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
  },

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  },

  // Additional utility for safe collection operations
  async clearCollection(collectionName: string): Promise<void> {
    const collection = mongoose.connection.collections[collectionName];
    if (collection) {
      await collection.deleteMany({});
    } else {
      logger.warn(`Collection ${collectionName} not found`);
    }
  },

  // Safe way to get all collection names
  async getCollectionNames(): Promise<string[]> {
    const db = mongoose.connection.db;
    if (!db) {
      return [];
    }
    
    const collections = await db.listCollections().toArray();
    return collections.map(col => col.name);
  }
};

// Export the connectDatabase function for backward compatibility
export const connectDatabase = databaseUtils.connectDatabase;
export const disconnectDatabase = databaseUtils.disconnectDatabase;