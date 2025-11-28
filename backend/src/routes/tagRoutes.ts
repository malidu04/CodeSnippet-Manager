import { Router } from 'express';
import { getTags, getPopularTags } from '../controllers/tagController';
import { optionalAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', optionalAuth, getTags);
router.get('/popular', optionalAuth, getPopularTags);

export default router;