import { seedUsers } from './userSeeds';
import { seedCategories } from './categorySeeds';
import { seedTags } from './tagSeeds';
import { seedSnippets } from './snippetSeeds';
import { logger } from '../utils/logger';

const runAllSeeds = async () => {
  try {
    logger.info('Starting database seeding...');
    
    await seedUsers();
    await seedCategories();
    await seedTags();
    await seedSnippets();
    
    logger.info('All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runAllSeeds();
}

export { runAllSeeds };