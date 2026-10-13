import type { User } from './user.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Usuario autenticado, cargado desde el repositorio por `authenticate`. */
      user?: User;
    }
  }
}
