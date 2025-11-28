import { Request, Response, NextFunction } from 'express';
import { tagService } from '../services/tagService';

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const tags = await tagService.getTags(search as string);
    
    res.json({
      success: true,
      data: { tags },
    });
  } catch (error) {
    next(error);
  }
};

export const getPopularTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10 } = req.query;
    const tags = await tagService.getPopularTags(Number(limit));
    
    res.json({
      success: true,
      data: { tags },
    });
  } catch (error) {
    next(error);
  }
};