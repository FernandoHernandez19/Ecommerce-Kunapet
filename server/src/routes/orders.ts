import { Router, type RequestHandler } from 'express';
import type { createOrderController } from '../controllers/orderController.js';
import { requireRole } from '../middleware/auth.js';

export function ordersRouter(controller: ReturnType<typeof createOrderController>, authenticate: RequestHandler): Router {
  const router = Router();
  // Solo clientes (provider y admin → 403); los pedidos ajenos responden 404.
  router.use(authenticate, requireRole('client'));
  router.post('/', controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  return router;
}
