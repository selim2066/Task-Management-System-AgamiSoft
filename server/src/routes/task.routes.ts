import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { ROLES } from '../constants/roles';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/admin/all', authorize(ROLES.ADMIN), taskController.getAllAdmin);

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
