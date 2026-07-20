import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All project routes require authentication
router.use(authenticate);

router.post('/', projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;
