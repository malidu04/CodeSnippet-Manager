import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';
 
export interface AuthRequest extends Request {
  user?: any;
}

// ==============================
// AUTHENTICATE
// ==============================
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return; // 🔥 Required so TS knows we're done
    }

    const token = authHeader.substring(7);

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.',
      });
      return; // 🔥 Required
    }

    req.user = user;
    next();
    return; // 🔥 Makes TS happy
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
    return;
  }
};

// ==============================
// OPTIONAL AUTH
// ==============================
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findById(decoded.id).select('-password');
      req.user = user;
    }

    next();
    return;
  } catch {
    next(); // still allowed
    return;
  }
};

// ==============================
// AUTHORIZE (ROLES)
// ==============================
export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Not authenticated.',
      });
      return; // 🔥 Required
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return; // 🔥 Required
    }

    next();
    return;
  };
