import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../utils/validators';
import { TaskStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const taskController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const task = await taskService.createTask(req.user!, validatedData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        projectId: req.query.projectId as string | undefined,
        status: req.query.status as TaskStatus | undefined,
        search: req.query.search as string | undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const tasks = await taskService.getTasks(req.user!, filters);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async getAllAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const tasks = await taskService.getAllTasksAdmin(page, limit);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const task = await taskService.getTaskById(id, req.user!);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateTaskSchema.parse(req.body);
      const updatedTask = await taskService.updateTask(id, req.user!, validatedData);
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await taskService.deleteTask(id, req.user!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
