import { Router, type RequestHandler } from 'express';
import type { createAuthController } from '../controllers/authController.js';

export function authRouter(controller: ReturnType<typeof createAuthController>,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', authenticate, controller.me);
  return router;
}
