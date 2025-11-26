export const rateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
};