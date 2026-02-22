import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// OAuth routes
router.get('/login', AuthController.login);
router.get('/callback', AuthController.callback);

// Basic auth routes (keeping for backward compatibility if needed, or remove later)
router.post('/login', AuthController.loginBasic);

router.get('/status', AuthController.status);
router.post('/logout', AuthController.logout);

export const authRouter = router;
