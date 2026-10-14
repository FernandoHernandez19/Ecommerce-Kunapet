import { Router, type RequestHandler } from 'express';
import type { createPetController } from '../controllers/petController.js';
import { requireRole } from '../middleware/auth.js';

export function petsRouter(controller: ReturnType<typeof createPetController>, authenticate: RequestHandler): Router {
  const router = Router();
  // Solo clientes; la propiedad se verifica en el servicio (ajena → 404).
  router.use(authenticate, requireRole('client'));
  router.get('/', controller.list);
  router.post('/', controller.create);
  router.get('/:id', controller.get);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}
