import { Router } from 'express';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { categoryValidator } from '../validators/commonValidators';

const router = Router();

router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategory);
router.post('/', authenticate, validate({ body: categoryValidator }), createCategory);
router.put('/:id', authenticate, validate({ body: categoryValidator }), updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;