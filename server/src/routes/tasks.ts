import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.get('/', TaskController.list);
router.post('/sync', TaskController.sync);

export const taskRouter = router;
