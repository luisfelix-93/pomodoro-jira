import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

router.post('/login', AuthController.login);
router.get('/status', AuthController.status);
router.post('/logout', AuthController.logout);

export const authRouter = router;
