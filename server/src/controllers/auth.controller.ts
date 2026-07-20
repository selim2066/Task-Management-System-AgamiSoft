import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validators';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.registerUser(validatedData.name, validatedData.email, validatedData.password);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.loginUser(validatedData.email, validatedData.password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
