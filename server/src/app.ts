import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from './utils/prisma';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Future route mounts will go here:
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes)

app.get('/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ status: 'ok', db: 'connected', userCount });
  } catch (error) {
    next(error);
  }
});

// Catch-all 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
    return;
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    details: err.details || null,
  });
});

export default app;
