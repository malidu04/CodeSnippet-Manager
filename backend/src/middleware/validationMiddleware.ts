import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

type Schema = {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
};

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    const parts: Array<keyof Schema> = ['body', 'params', 'query'];

    for (const part of parts) {
      if (schema[part]) {
        const { error } = schema[part]!.validate(req[part], {
          abortEarly: false,
          allowUnknown: false,
        });

        if (error) {
          const detailMessages = error.details.map((d) => `${part}: ${d.message}`);
          errors.push(...detailMessages);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return; // Ensure TypeScript knows the function exits here
    }

    next(); // Call next if validation passed
  };
};
