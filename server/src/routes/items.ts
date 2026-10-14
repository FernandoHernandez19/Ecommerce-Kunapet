import { Router, type RequestHandler } from 'express';
import { requireRole } from '../middleware/auth.js';
import type { createItemController } from '../controllers/itemController.js';

export function itemsRouter(controller: ReturnType<typeof createItemController>,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  // Solo proveedores; la propiedad del item se verifica en el servicio (ajeno → 404).
  const providerOnly = [authenticate, requireRole('provider')];
  router.post('/', ...providerOnly, controller.create);
  router.patch('/:id', ...providerOnly, controller.update);
  router.delete('/:id', ...providerOnly, controller.remove);
  return router;
}
