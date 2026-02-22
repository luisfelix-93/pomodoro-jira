import { Router } from 'express';
import { WorklogController } from '../controllers/worklogController';

const router = Router();

router.post('/', WorklogController.create);
router.get('/', WorklogController.list);
router.post('/sync', WorklogController.sync);
router.delete('/:id', WorklogController.delete);

export const worklogRouter = router;
