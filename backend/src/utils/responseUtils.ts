import { Response } from 'express';

export const responseUtils = {
  sendSuccess(
    res: Response,
    data: any = null,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  sendError(
    res: Response,
    message: string = 'Error occurred',
    statusCode: number = 500,
    errors: any[] = []
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  },

  sendValidationError(
    res: Response,
    errors: any[] = [],
    message: string = 'Validation failed'
  ): Response {
    return this.sendError(res, message, 400, errors);
  },

  sendNotFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.sendError(res, message, 404);
  },

  sendUnauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): Response {
    return this.sendError(res, message, 401);
  },

  sendForbidden(
    res: Response,
    message: string = 'Access forbidden'
  ): Response {
    return this.sendError(res, message, 403);
  },

  paginateResponse(
    res: Response,
    data: any[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return this.sendSuccess(res, {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null,
      },
    }, message);
  },
};