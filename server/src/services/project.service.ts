import { prisma } from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { ROLES } from '../constants/roles';

interface UserContext {
  id: string;
  email: string;
  role: string;
}

export const projectService = {
  async createProject(ownerId: string, data: { name: string; description?: string }) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId,
      },
    });
    return project;
  },

  async getProjects(user: UserContext, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    if (user.role === ROLES.ADMIN) {
      const totalItems = await prisma.project.count();
      const data = await prisma.project.findMany({
        skip,
        take: limit,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { tasks: true },
          },
          tasks: {
            where: { status: 'DONE' },
            select: { id: true },
          },
        },
      });

      const mappedData = data.map(project => {
        const { tasks, ...rest } = project;
        return { ...rest, doneTasksCount: tasks.length };
      });

      return { data: mappedData, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
    }

    const where = { ownerId: user.id };
    const totalItems = await prisma.project.count({ where });
    const data = await prisma.project.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          where: { status: 'DONE' },
          select: { id: true },
        },
      },
    });

    const mappedData = data.map(project => {
      const { tasks, ...rest } = project;
      return { ...rest, doneTasksCount: tasks.length };
    });

    return { data: mappedData, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
  },

  async getProjectById(id: string, user: UserContext) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { tasks: true },
        },
        tasks: {
          where: { status: 'DONE' },
          select: { id: true },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (user.role !== ROLES.ADMIN && project.ownerId !== user.id) {
      throw new AppError('Forbidden: You do not have access to this project', 403);
    }

    const { tasks, ...rest } = project;
    return { ...rest, doneTasksCount: tasks.length };
  },

  async updateProject(id: string, user: UserContext, data: { name?: string; description?: string }) {
    // Re-use getProjectById for existence and authorization checks
    await this.getProjectById(id, user);

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });

    return updatedProject;
  },

  async deleteProject(id: string, user: UserContext) {
    // Re-use getProjectById for existence and authorization checks
    await this.getProjectById(id, user);

    await prisma.project.delete({
      where: { id },
    });
  },

  async getAllProjectsAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const totalItems = await prisma.project.count();
    const data = await prisma.project.findMany({
      skip,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { tasks: true },
        },
        tasks: {
          where: { status: 'DONE' },
          select: { id: true },
        },
      },
    });

    const mappedData = data.map(project => {
      const { tasks, ...rest } = project;
      return { ...rest, doneTasksCount: tasks.length };
    });

    return { data: mappedData, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
  },
};
