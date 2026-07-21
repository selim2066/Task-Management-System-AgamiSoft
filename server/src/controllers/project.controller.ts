import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { createProjectSchema, updateProjectSchema } from '../utils/validators';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const projectController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      // req.user is guaranteed by the authenticate middleware
      const project = await projectService.createProject(req.user!.id, validatedData);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await projectService.getProjects(req.user!, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getAllAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await projectService.getAllProjectsAdmin(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const project = await projectService.getProjectById(id, req.user!);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateProjectSchema.parse(req.body);
      const updatedProject = await projectService.updateProject(id, req.user!, validatedData);
      res.status(200).json(updatedProject);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await projectService.deleteProject(id, req.user!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
