import type { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import type { TokenService } from '../services/TokenService.js';
import { toPublicUser, type Role } from '../types/user.js';
import '../types/express.js';

const BEARER = /^Bearer ([^\s]+)$/i;

/**
 * Exige un JWT válido y vuelve a cargar al usuario del repositorio en cada petición.
 * Todos los fallos responden el mismo 401 para no dar pistas.
 */
export function createAuthenticate(tokens: TokenService, users: UserRepository): RequestHandler {
  return async (req, _res, next) => {
    const match = BEARER.exec(req.headers.authorization ?? '');
    if (!match?.[1]) throw new UnauthorizedError();

    const claims = tokens.verify(match[1]);
    const record = await users.findById(claims.sub);
    if (!record) throw new UnauthorizedError();

    req.user = toPublicUser(record);
    next();
  };
}

/**
 * Para endpoints públicos que muestran más al usuario autenticado: si hay un token válido
 * carga `req.user`; si falta o es inválido, la petición sigue como anónima.
 */
export function createOptionalAuthenticate(tokens: TokenService, users: UserRepository): RequestHandler {
  const strict = createAuthenticate(tokens, users);
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      next();
      return;
    }
    try {
      await strict(req, res, () => undefined);
    } catch {
      // Token inválido en un endpoint público: se trata como anónimo.
    }
    next();
  };
}

/** Permite el paso solo si el usuario autenticado tiene alguno de los roles. */
export function requireRole(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) throw new UnauthorizedError();
    if (!roles.includes(req.user.role)) throw new ForbiddenError();
    next();
  };
}
