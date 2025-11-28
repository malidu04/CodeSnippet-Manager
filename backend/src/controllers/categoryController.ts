import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { categoryService } from '../services/categoryService';
import { logger } from '../utils/logger';

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const categories = await categoryService.getUserCategories(userId);
    
    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id!;
    const userId = req.user._id;

    const category = await categoryService.getCategoryById(categoryId, userId);

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};


export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const categoryData = { ...req.body, user: userId };
    
    const category = await categoryService.createCategory(categoryData);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id!;
    const userId = req.user._id;
    const updateData = req.body;
    
    const category = await categoryService.updateCategory(categoryId, userId, updateData);
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id!;
    const userId = req.user._id;
    
    await categoryService.deleteCategory(categoryId, userId);
    
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};