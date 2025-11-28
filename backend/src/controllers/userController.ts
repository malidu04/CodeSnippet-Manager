import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { userService } from '../services/userService';
import { snippetService } from '../services/snippetService';
import { logger } from '../utils/logger';

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user._id);
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;
    
    const updatedUser = await userService.updateUser(userId, updateData);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    await userService.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSnippets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, programmingLanguage, search } = req.query;
    
    const filters = {
      page: Number(page),
      limit: Number(limit),
      programmingLanguage: programmingLanguage as string,
      search: search as string,
    };
    
    const result = await snippetService.getSnippetsByUser(userId, filters);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const stats = await userService.getUserStats(userId);
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};