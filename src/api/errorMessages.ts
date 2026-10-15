/**
 * Traduce un error de la API a un mensaje amigable en español.
 */
import { isApiError } from './ApiError';

const GENERIC = 'Ocurrió un error inesperado. Inténtalo de nuevo.';

export type ErrorContext = 'login' | 'register' | 'generic';

/** Primer mensaje de `details` cuando el servidor lo envía como [{ path, message }]. */
function firstDetailMessage(details: unknown): string | undefined {
  if (!Array.isArray(details)) return undefined;
  const first: unknown = details[0];
  if (typeof first === 'object' && first !== null && 'message' in first && typeof first.message === 'string') {
    return first.message;
  }
  return undefined;
}

export function friendlyMessage(err: unknown, context: ErrorContext = 'generic'): string {
  if (!isApiError(err)) return GENERIC;

  switch (err.code) {
    case 'network_error':
    case 'timeout':
    case 'invalid_response':
      return err.message; // ya viene en español desde el cliente
    case 'rate_limited':
      return context === 'register'
        ? 'Se alcanzó el límite de registros desde tu red. Inténtalo más tarde.'
        : 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
    case 'service_unavailable':
      return err.message || 'El servicio no está disponible por ahora.';
    case 'unauthorized':
      return context === 'login' ? 'Correo o contraseña incorrectos.' : 'Tu sesión expiró. Inicia sesión de nuevo.';
    case 'conflict':
      return context === 'register'
        ? 'Ese correo ya está registrado. Inicia sesión o usa otro correo.'
        : 'El recurso ya existe.';
    case 'validation_error':
      return firstDetailMessage(err.details) ?? (context === 'login' ? 'Revisa tu correo y contraseña.' : 'Revisa los datos ingresados.');
    case 'not_found':
      return 'No encontramos lo que buscas.';
    case 'unprocessable_entity':
      return err.message || 'No se pudo procesar la solicitud.';
    case 'forbidden':
      return 'No tienes permiso para realizar esta acción.';
    case 'internal_error':
    case 'aborted':
      return GENERIC;
  }
}
