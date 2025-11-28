import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  refreshToken, 
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { 
  registerValidator, 
  loginValidator, 
  emailValidator, 
  resetPasswordValidator 
} from '../validators/authValidators';

const router = Router();

router.post('/register', validate({ body: registerValidator }), register);
router.post('/login', validate({ body: loginValidator }), login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, getCurrentUser);
router.post('/verify-email', validate({ body: emailValidator }), verifyEmail);
router.post('/forgot-password', validate({ body: emailValidator }), forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordValidator }), resetPassword);

export default router;