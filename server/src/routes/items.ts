import { Router } from 'express';
import type { createItemController } from '../controllers/itemController.js';

export function itemsRouter(controller: ReturnType<typeof createItemController>): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  return router;
}
