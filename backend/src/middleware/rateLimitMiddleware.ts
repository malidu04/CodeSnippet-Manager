import rateLimit from "express-rate-limit";
import { rateLimitConfig } from '../config/rateLimit';

export const rateLimitMiddleware = rateLimit(rateLimitConfig);
