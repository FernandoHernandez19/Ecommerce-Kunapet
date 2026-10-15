/**
 * ApiError — error tipado de la API de KunaPet.
 *
 * Refleja el formato uniforme del contrato (docs/api-contract.md §1.2):
 *   { "error": { "code": string, "message": string, "details"?: unknown } }
 * más `status` (HTTP; 0 si no hubo respuesta).
 */
export class ApiError extends Error {
  constructor({ status = 0, code = 'internal_error', message = 'Ocurrió un error inesperado.', details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isApiError = (err) => err instanceof ApiError;
