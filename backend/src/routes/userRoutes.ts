import { Router } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserAccount,
  getUserSnippets,
  getUserStats
} from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { updateProfileValidator } from '../validators/userValidators';

const router = Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, validate({ body: updateProfileValidator }), updateUserProfile);
router.delete('/profile', authenticate, deleteUserAccount);
router.get('/snippets', authenticate, getUserSnippets);
router.get('/stats', authenticate, getUserStats);

export default router;