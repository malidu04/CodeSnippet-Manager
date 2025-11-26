import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middleware/corsMiddleware';
import { rateLimitMiddleware } from './middleware/rateLimitMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import snippetRoutes from './routes/snippetRoutes';
import categoryRoutes from './routes/categoryRoutes';
import tagRoutes from './routes/tagRoutes';

const app = express();

app.use(helmet());

app.use(corsMiddleware);

app.use(rateLimitMiddleware);

app.use(loggerMiddleware);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;