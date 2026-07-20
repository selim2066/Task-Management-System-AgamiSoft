import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional().default("TODO"),
  projectId: z.string().uuid("Invalid Project ID"),
  assignedToId: z.string().uuid("Invalid Assignee ID").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  projectId: z.string().uuid("Invalid Project ID").optional(),
  assignedToId: z.string().uuid("Invalid Assignee ID").optional(),
});
