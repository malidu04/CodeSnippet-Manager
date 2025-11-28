import { Router } from 'express';
import { 
  getSnippets, 
  getSnippet, 
  createSnippet, 
  updateSnippet, 
  deleteSnippet,
  toggleSnippetFavorite,
  getUserSnippets,
  getPublicSnippets
} from '../controllers/snippestController';
import { authenticate, optionalAuth } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { 
  snippetCreateValidator, 
  snippetUpdateValidator,
  snippetQueryValidator 
} from '../validators/snippetValidators';

const router = Router();

router.get('/', optionalAuth, validate({ query: snippetQueryValidator }), getSnippets);
router.get('/public', validate({ query: snippetQueryValidator }), getPublicSnippets);
router.get('/user', authenticate, validate({ query: snippetQueryValidator }), getUserSnippets);
router.get('/:id', optionalAuth, getSnippet);
router.post('/', authenticate, validate({ body: snippetCreateValidator }), createSnippet);
router.put('/:id', authenticate, validate({ body: snippetUpdateValidator }), updateSnippet);
router.delete('/:id', authenticate, deleteSnippet);
router.post('/:id/favorite', authenticate, toggleSnippetFavorite);

export default router;