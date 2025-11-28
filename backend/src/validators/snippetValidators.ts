import Joi from 'joi';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

export const snippetCreateValidator = Joi.object({
  title: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  code: Joi.string()
    .required()
    .messages({
      'any.required': 'Code is required',
    }),
  programmingLanguage: Joi.string()
    .valid(...SUPPORTED_LANGUAGES)
    .required()
    .messages({
      'any.only': `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
      'any.required': 'Language is required',
    }),
  tags: Joi.array()
    .items(Joi.string().max(30).pattern(/^[a-zA-Z0-9_\-]+$/))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.pattern.base': 'Tags can only contain letters, numbers, hyphens, and underscores',
      'string.max': 'Tag cannot exceed 30 characters',
    }),
  category: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Category must be a valid MongoDB ID',
      'string.length': 'Category must be a valid MongoDB ID',
      'any.required': 'Category is required',
    }),
  isPublic: Joi.boolean()
    .default(true)
    .optional(),
});

export const snippetUpdateValidator = Joi.object({
  title: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Title cannot exceed 100 characters',
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  code: Joi.string()
    .optional(),
  programmingLanguage: Joi.string()
    .valid(...SUPPORTED_LANGUAGES)
    .optional()
    .messages({
      'any.only': `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
    }),
  tags: Joi.array()
    .items(Joi.string().max(30).pattern(/^[a-zA-Z0-9_\-]+$/))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.pattern.base': 'Tags can only contain letters, numbers, hyphens, and underscores',
      'string.max': 'Tag cannot exceed 30 characters',
    }),
  category: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      'string.hex': 'Category must be a valid MongoDB ID',
      'string.length': 'Category must be a valid MongoDB ID',
    }),
  isPublic: Joi.boolean()
    .optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const snippetQueryValidator = Joi.object({
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
  programmingLanguage: Joi.string()
    .valid(...SUPPORTED_LANGUAGES)
    .optional()
    .messages({
      'any.only': `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
    }),
  search: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Search query cannot exceed 100 characters',
    }),
  category: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      'string.hex': 'Category must be a valid MongoDB ID',
      'string.length': 'Category must be a valid MongoDB ID',
    }),
  tags: Joi.string()
    .optional(),
});