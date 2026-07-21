import { prisma } from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { TaskStatus } from '@prisma/client';
import { ROLES } from '../constants/roles';

interface UserContext {
  id: string;
  email: string;
  role: string;
}

interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const taskService = {
  async createTask(user: UserContext, data: { title: string; description?: string; status?: TaskStatus; projectId: string; assignedToId?: string }) {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (user.role !== ROLES.ADMIN && project.ownerId !== user.id) {
      throw new AppError('Forbidden: You do not have access to create tasks in this project', 403);
    }

    const task = await prisma.task.create({
      data,
    });

    return task;
  },

  async getTasks(user: UserContext, filters: TaskFilters) {
    const where: any = {};
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    if (user.role !== ROLES.ADMIN) {
      where.OR = [
        { project: { ownerId: user.id } },
        { assignedToId: user.id },
      ];
    }

    const totalItems = await prisma.task.count({ where });
    const data = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });
    
    return { data, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
  },

  async getTaskById(id: string, user: UserContext) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (user.role !== ROLES.ADMIN && task.project.ownerId !== user.id && task.assignedToId !== user.id) {
      throw new AppError('Forbidden: You do not have access to this task', 403);
    }

    return task;
  },

  async updateTask(id: string, user: UserContext, data: any) {
    await this.getTaskById(id, user);

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
    });

    return updatedTask;
  },

  async deleteTask(id: string, user: UserContext) {
    await this.getTaskById(id, user);

    await prisma.task.delete({
      where: { id },
    });
  },

  async getAllTasksAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const totalItems = await prisma.task.count();
    const data = await prisma.task.findMany({
      skip,
      take: limit,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });
    
    return { data, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
  },
};
