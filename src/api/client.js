/**
 * Cliente HTTP de KunaPet: fetch con URL base, JSON, token del useAuthStore,
 * errores tipados (ApiError), timeout y manejo de sesión expirada.
 *
 * Nunca se imprime ni se registra el token ni el cuerpo de las peticiones.
 */
import useAuthStore from '../store/useAuthStore';
import { trackRequest } from '../store/useServerStatusStore';
import { ApiError } from './ApiError';

export const DEFAULT_API_URL = 'http://localhost:3000/api/v1';
// El plan gratuito de Render puede tardar hasta ~1 min en despertar.
export const REQUEST_TIMEOUT_MS = 45_000;

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

const MESSAGES = {
  aborted: 'La petición fue cancelada.',
  network_error: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
  timeout: 'El servidor tardó demasiado en responder. Inténtalo de nuevo en unos segundos.',
  unexpected: 'El servidor respondió de forma inesperada. Inténtalo de nuevo.',
};

const CODE_BY_STATUS = {
  400: 'validation_error',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  429: 'rate_limited',
  503: 'service_unavailable',
};

// ─── Sesión expirada ─────────────────────────────────────────────────────────
// App registra una función que navega a /login conservando la ruta de origen.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

function handleUnauthorized() {
  useAuthStore.getState().logout();
  if (unauthorizedHandler) {
    unauthorizedHandler();
  } else if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

async function readBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return undefined; // respuesta que no es JSON
  }
}

function toApiError(response, body) {
  const err = body && typeof body === 'object' ? body.error : undefined;
  if (err && typeof err.code === 'string' && typeof err.message === 'string') {
    return new ApiError({ status: response.status, code: err.code, message: err.message, details: err.details });
  }
  return new ApiError({
    status: response.status,
    code: CODE_BY_STATUS[response.status] ?? 'internal_error',
    message: MESSAGES.unexpected,
  });
}

/**
 * @param {string} path  Ruta relativa a la URL base, p. ej. '/auth/login'.
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {unknown} [options.body]              Se envía como JSON.
 * @param {boolean} [options.auth=true]         Adjunta Authorization si hay token.
 * @param {boolean} [options.handleUnauthorized=true]  Un 401 cierra sesión y redirige a /login.
 * @param {number} [options.timeoutMs]
 * @param {AbortSignal} [options.signal]   Cancela la petición (p. ej. al desmontar); lanza ApiError 'aborted'.
 * @returns {Promise<any>} JSON de la respuesta (null si 204).
 * @throws {ApiError}
 */
export async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    handleUnauthorized: redirectOn401 = true,
    timeoutMs = REQUEST_TIMEOUT_MS,
    signal: externalSignal,
  } = options;

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = auth ? useAuthStore.getState().token : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const doneTracking = trackRequest(); // avisa si el servidor tarda en despertar
  const controller = new AbortController();
  let timedOut = false;
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  let response;
  let parsed;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    parsed = await readBody(response);
  } catch {
    // Nunca se incluye el error original: podría contener la URL o cabeceras.
    if (externalSignal?.aborted) throw new ApiError({ status: 0, code: 'aborted', message: MESSAGES.aborted });
    throw timedOut
      ? new ApiError({ status: 0, code: 'timeout', message: MESSAGES.timeout })
      : new ApiError({ status: 0, code: 'network_error', message: MESSAGES.network_error });
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
    doneTracking();
  }

  if (!response.ok) {
    const error = toApiError(response, parsed);
    if (response.status === 401 && redirectOn401) handleUnauthorized();
    throw error;
  }
  if (parsed === undefined) {
    throw new ApiError({ status: response.status, code: 'internal_error', message: MESSAGES.unexpected });
  }
  return parsed;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { ApiError };
