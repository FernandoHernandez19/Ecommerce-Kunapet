export type ErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'unprocessable_entity'
  | 'rate_limited'
  | 'service_unavailable'
  | 'internal_error';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos.', details?: unknown) {
    super(400, 'validation_error', message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado o token inválido.') {
    super(401, 'unauthorized', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permiso para realizar esta acción.') {
    super(403, 'forbidden', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado.') {
    super(404, 'not_found', message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe.') {
    super(409, 'conflict', message);
  }
}

export class UnprocessableError extends AppError {
  constructor(message = 'No se puede procesar la solicitud.', details?: unknown) {
    super(422, 'unprocessable_entity', message, details);
  }
}

export class RateLimitedError extends AppError {
  constructor(message = 'Demasiados intentos. Inténtalo más tarde.') {
    super(429, 'rate_limited', message);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'El servicio no está disponible por ahora.') {
    super(503, 'service_unavailable', message);
  }
}
