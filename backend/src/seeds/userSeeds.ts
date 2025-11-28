import dotenv from 'dotenv';
dotenv.config(); // <- Load .env variables at the top

import mongoose from 'mongoose';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';
import { logger } from '../utils/logger';

const users = [
  {
    username: 'admin',
    email: 'admin@codesnippet.com',
    password: 'Admin123!',
    role: 'admin' as const,
    isVerified: true,
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'user' as const,
    isVerified: true,
  },
  {
    username: 'sarahdev',
    email: 'sarah@example.com',
    password: 'Password123!',
    role: 'user' as const,
    isVerified: true,
  },
];

const seedUsers = async () => {
  try {
    await connectDatabase(); // connect to MongoDB

    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Create users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      logger.info(`Created user: ${user.username}`);
    }

    logger.info('Users seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedUsers();
}

export { seedUsers };
