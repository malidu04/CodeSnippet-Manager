import dotenv from 'dotenv';
dotenv.config(); // <- Load .env variables at the top

import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';
import { logger } from '../utils/logger';

const categories = [
  {
    name: 'JavaScript',
    description: 'JavaScript code snippets',
    color: '#F7DF1E',
  },
  {
    name: 'TypeScript',
    description: 'TypeScript code snippets',
    color: '#3178C6',
  },
  {
    name: 'Python',
    description: 'Python code snippets',
    color: '#3776AB',
  },
  {
    name: 'React',
    description: 'React components and hooks',
    color: '#61DAFB',
  },
  {
    name: 'Node.js',
    description: 'Node.js server-side code',
    color: '#339933',
  },
  {
    name: 'CSS',
    description: 'CSS styles and animations',
    color: '#1572B6',
  },
  {
    name: 'Database',
    description: 'Database queries and operations',
    color: '#336791',
  },
  {
    name: 'Utilities',
    description: 'Utility functions and helpers',
    color: '#8A2BE2',
  },
];

const seedCategories = async () => {
  try {
    await connectDatabase(); // Connect to MongoDB

    // Get admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please run user seeds first.');
    }

    // Clear existing categories
    await Category.deleteMany({});
    logger.info('Cleared existing categories');

    // Create categories
    for (const categoryData of categories) {
      const category = new Category({
        ...categoryData,
        user: adminUser._id,
      });
      await category.save();
      logger.info(`Created category: ${category.name}`);
    }

    logger.info('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedCategories();
}

export { seedCategories };
