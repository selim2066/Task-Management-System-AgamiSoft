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

  async getProjects(user: UserContext) {
    if (user.role === ROLES.ADMIN) {
      return await prisma.project.findMany({
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
      });
    }

    return await prisma.project.findMany({
      where: { ownerId: user.id },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
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
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (user.role !== ROLES.ADMIN && project.ownerId !== user.id) {
      throw new AppError('Forbidden: You do not have access to this project', 403);
    }

    return project;
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

  async getAllProjectsAdmin() {
    return await prisma.project.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });
  },
};
