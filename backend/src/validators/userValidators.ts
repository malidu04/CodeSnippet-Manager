import Joi from 'joi';

export const updateProfileValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Avatar must be a valid URL',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const changePasswordValidator = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required',
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required',
    }),
});