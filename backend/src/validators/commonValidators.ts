import Joi from 'joi';

export const objectIdValidator = Joi.string()
  .hex()
  .length(24)
  .messages({
    'string.hex': 'Must be a valid MongoDB ID',
    'string.length': 'Must be a valid MongoDB ID',
  });

export const paginationValidator = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional(),
});

export const categoryValidator = Joi.object({
  name: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.max': 'Category name cannot exceed 50 characters',
      'any.required': 'Category name is required',
    }),
  description: Joi.string()
    .max(200)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 200 characters',
    }),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .default('#3B82F6')
    .optional()
    .messages({
      'string.pattern.base': 'Color must be a valid hex color code',
    }),
});

export const searchValidator = Joi.object({
  search: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Search query cannot exceed 100 characters',
    }),
});