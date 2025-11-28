import { Response, NextFunction, Request } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { snippetService } from '../services/snippetService';
import { logger } from '../utils/logger';

export const getSnippets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 10, programmingLanguage, search, category, tags } = req.query;
    
    const filters = {
      page: Number(page),
      limit: Number(limit),
      programmingLanguage: programmingLanguage as string,
      search: search as string,
      category: category as string,
      tags: tags as string,
      userId: userId as string,
    };
    
    const result = await snippetService.getSnippets(filters);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicSnippets = async (
  req: Request<{}, {}, {}, {
    page?: string;
    limit?: string;
    programmingLanguage?: string;
    search?: string;
    category?: string;
    tags?: string;
  }>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, programmingLanguage, search, category, tags } = req.query;
    
    const filters = {
      page: Number(page),
      limit: Number(limit),
      programmingLanguage: programmingLanguage as string,
      search: search as string,
      category: category as string,
      tags: tags as string,
      publicOnly: true,
    };
    
    const result = await snippetService.getSnippets(filters);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSnippet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const snippetId = req.params.id!;
    const userId = req.user?._id;
    
    const snippet = await snippetService.getSnippetById(snippetId, userId);
    
    res.json({
      success: true,
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

export const createSnippet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const snippetData = { ...req.body, user: userId };
    
    const snippet = await snippetService.createSnippet(snippetData);
    
    res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSnippet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const snippetId = req.params.id!;
    const userId = req.user._id;
    const updateData = req.body;
    
    const snippet = await snippetService.updateSnippet(snippetId, userId, updateData);
    
    res.json({
      success: true,
      message: 'Snippet updated successfully',
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSnippet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const snippetId = req.params.id!;
    const userId = req.user._id;
    
    await snippetService.deleteSnippet(snippetId, userId);
    
    res.json({
      success: true,
      message: 'Snippet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSnippetFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const snippetId = req.params.id!;
    const userId = req.user._id;
    
    const result = await snippetService.toggleFavorite(snippetId, userId);
    
    res.json({
      success: true,
      message: result.isFavorited ? 'Snippet added to favorites' : 'Snippet removed from favorites',
      data: result,
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