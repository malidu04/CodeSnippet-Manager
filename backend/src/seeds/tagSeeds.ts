import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Tag } from '../models/Tag';
import { connectDatabase } from '../config/database';
import { logger } from '../utils/logger';

const tags = [
  { name: 'authentication', snippetCount: 0 },
  { name: 'api', snippetCount: 0 },
  { name: 'crud', snippetCount: 0 },
  { name: 'validation', snippetCount: 0 },
  { name: 'hooks', snippetCount: 0 },
  { name: 'components', snippetCount: 0 },
  { name: 'middleware', snippetCount: 0 },
  { name: 'database', snippetCount: 0 },
  { name: 'security', snippetCount: 0 },
  { name: 'performance', snippetCount: 0 },
  { name: 'testing', snippetCount: 0 },
  { name: 'deployment', snippetCount: 0 },
  { name: 'docker', snippetCount: 0 },
  { name: 'aws', snippetCount: 0 },
];


const seedTags = async () => {
  try {
    await connectDatabase();
    
    // Clear existing tags
    await Tag.deleteMany({});
    logger.info('Cleared existing tags');
    
    // Create tags
    for (const tagData of tags) {
      const tag = new Tag(tagData);
      await tag.save();
      logger.info(`Created tag: ${tag.name}`);
    }
    
    logger.info('Tags seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding tags:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedTags();
}

export { seedTags };