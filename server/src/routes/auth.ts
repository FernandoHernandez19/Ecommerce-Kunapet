import { Router } from 'express';
import type { createAuthController } from '../controllers/authController.js';

export function authRouter(controller: ReturnType<typeof createAuthController>): Router {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  return router;
}
