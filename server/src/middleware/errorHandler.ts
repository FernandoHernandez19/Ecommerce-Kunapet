import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, NotFoundError } from '../errors/AppError.js';

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new NotFoundError('Ruta no encontrada.'));
};

interface BodyParserError {
  type?: string;
  status?: number;
}

function isBodyParserError(err: unknown): err is Error & BodyParserError {
  return err instanceof Error && typeof (err as BodyParserError).type === 'string';
}

export function createErrorHandler(): ErrorRequestHandler {
  // El parámetro `next` es necesario para que Express reconozca un manejador de errores.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, _req, res, _next) => {
    if (err instanceof AppError) {
      res.status(err.status).json({
        error: {
          code: err.code,
          message: err.message,
          ...(err.details !== undefined ? { details: err.details } : {}),
        },
      });
      return;
    }

    if (isBodyParserError(err)) {
      const tooLarge = err.type === 'entity.too.large';
      res.status(400).json({
        error: {
          code: 'validation_error',
          message: tooLarge
            ? 'El cuerpo de la petición supera el límite de 100 kb.'
            : 'El cuerpo de la petición no es un JSON válido.',
        },
      });
      return;
    }

    // Solo se registra el tipo de error: nunca el request, headers ni cuerpo.
    console.error(`[error] ${err instanceof Error ? err.name : 'desconocido'}`);
    res.status(500).json({
      error: { code: 'internal_error', message: 'Error interno del servidor.' },
    });
  };
}
