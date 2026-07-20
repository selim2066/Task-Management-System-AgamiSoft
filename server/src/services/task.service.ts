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

    return await prisma.task.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });
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

  async getAllTasksAdmin() {
    return await prisma.task.findMany({
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });
  },
};
