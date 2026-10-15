/**
 * Traduce un error de la API a un mensaje amigable en español.
 * @param {unknown} err   Normalmente un ApiError.
 * @param {'login'|'register'|'generic'} [context]
 */
import { isApiError } from './ApiError';

const GENERIC = 'Ocurrió un error inesperado. Inténtalo de nuevo.';

export function friendlyMessage(err, context = 'generic') {
  if (!isApiError(err)) return GENERIC;

  switch (err.code) {
    case 'network_error':
    case 'timeout':
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
    case 'validation_error': {
      const first = Array.isArray(err.details) ? err.details[0] : undefined;
      if (first && typeof first.message === 'string') return first.message;
      return context === 'login' ? 'Revisa tu correo y contraseña.' : 'Revisa los datos ingresados.';
    }
    case 'forbidden':
      return 'No tienes permiso para realizar esta acción.';
    default:
      return GENERIC;
  }
}
