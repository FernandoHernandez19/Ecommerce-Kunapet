/**
 * Cliente HTTP de KunaPet: fetch con URL base, JSON, token del useAuthStore,
 * errores tipados (ApiError), timeout y manejo de sesión expirada.
 *
 * Las respuestas se validan en la frontera: si se pasa un `schema` (zod), la respuesta se
 * parsea y el resultado queda tipado (`Promise<T>`); un cuerpo que no cumple el contrato
 * lanza ApiError "invalid_response". Sin `schema` el resultado es `unknown`.
 *
 * Nunca se imprime ni se registra el token ni el cuerpo de las peticiones.
 */
import type { z } from 'zod';
import useAuthStore from '../store/useAuthStore';
import { trackRequest } from '../store/useServerStatusStore';
import { isApiErrorCode, type ApiErrorCode } from '@/types/api';
import { ApiError } from './ApiError';
import { apiErrorBodySchema } from './schemas';

export const DEFAULT_API_URL = 'http://localhost:3000/api/v1';
// El plan gratuito de Render puede tardar hasta ~1 min en despertar.
export const REQUEST_TIMEOUT_MS = 45_000;

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

const MESSAGES = {
  aborted: 'La petición fue cancelada.',
  network_error: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
  timeout: 'El servidor tardó demasiado en responder. Inténtalo de nuevo en unos segundos.',
  unexpected: 'El servidor respondió de forma inesperada. Inténtalo de nuevo.',
  invalid_response: 'El servidor respondió con datos inesperados. Inténtalo de nuevo.',
} as const;

const CODE_BY_STATUS: Readonly<Record<number, ApiErrorCode>> = {
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
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler): () => void {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

function handleUnauthorized(): void {
  useAuthStore.getState().logout();
  if (unauthorizedHandler) {
    unauthorizedHandler();
  } else if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

/** Cuerpo JSON de la respuesta; `null` si no hay cuerpo; `undefined` si no es JSON. */
async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function toApiError(response: Response, body: unknown): ApiError {
  const parsed = apiErrorBodySchema.safeParse(body);
  if (parsed.success) {
    const { code, message, details } = parsed.data.error;
    // Un código que el cliente no conoce se trata como error interno (el mensaje se conserva).
    return new ApiError({ status: response.status, code: isApiErrorCode(code) ? code : 'internal_error', message, details });
  }
  return new ApiError({
    status: response.status,
    code: CODE_BY_STATUS[response.status] ?? 'internal_error',
    message: MESSAGES.unexpected,
  });
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  /** Se envía como JSON. */
  body?: unknown;
  /** Adjunta Authorization si hay token (por defecto sí). */
  auth?: boolean;
  /** Un 401 cierra sesión y redirige a /login (por defecto sí). */
  handleUnauthorized?: boolean;
  timeoutMs?: number;
  /** Cancela la petición (p. ej. al desmontar); lanza ApiError 'aborted'. */
  signal?: AbortSignal;
}

/** Opciones con esquema: el resultado de `request` queda tipado como T. */
export type ValidatedOptions<T> = RequestOptions & { schema: z.ZodType<T> };

/**
 * @throws {ApiError}
 */
export async function request<T>(path: string, options: ValidatedOptions<T>): Promise<T>;
export async function request(path: string, options?: RequestOptions): Promise<unknown>;
export async function request(path: string, options: RequestOptions & { schema?: z.ZodType } = {}): Promise<unknown> {
  const {
    method = 'GET',
    body,
    auth = true,
    handleUnauthorized: redirectOn401 = true,
    timeoutMs = REQUEST_TIMEOUT_MS,
    signal: externalSignal,
    schema,
  } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = auth ? useAuthStore.getState().token : null;
  if (token) headers['Authorization'] = `Bearer ${token}`;

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

  let response: Response;
  let parsed: unknown;
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
    throw new ApiError({ status: response.status, code: 'invalid_response', message: MESSAGES.invalid_response });
  }
  if (schema) {
    const result = schema.safeParse(parsed);
    // Se informa el problema SIN datos del usuario: solo ruta y código de cada incidencia.
    if (!result.success) {
      throw new ApiError({
        status: response.status,
        code: 'invalid_response',
        message: MESSAGES.invalid_response,
        details: result.error.issues.map((i) => ({ path: i.path.join('.'), code: i.code })),
      });
    }
    return result.data;
  }
  return parsed;
}

type BodyOptions = Omit<RequestOptions, 'method' | 'body'>;
type BodylessOptions = Omit<RequestOptions, 'method' | 'body'>;

function get<T>(path: string, options: BodylessOptions & { schema: z.ZodType<T> }): Promise<T>;
function get(path: string, options?: BodylessOptions): Promise<unknown>;
function get(path: string, options: BodylessOptions & { schema?: z.ZodType } = {}): Promise<unknown> {
  return request(path, { ...options, method: 'GET' });
}

function post<T>(path: string, body: unknown, options: BodyOptions & { schema: z.ZodType<T> }): Promise<T>;
function post(path: string, body?: unknown, options?: BodyOptions): Promise<unknown>;
function post(path: string, body?: unknown, options: BodyOptions & { schema?: z.ZodType } = {}): Promise<unknown> {
  return request(path, { ...options, method: 'POST', body });
}

function patch<T>(path: string, body: unknown, options: BodyOptions & { schema: z.ZodType<T> }): Promise<T>;
function patch(path: string, body?: unknown, options?: BodyOptions): Promise<unknown>;
function patch(path: string, body?: unknown, options: BodyOptions & { schema?: z.ZodType } = {}): Promise<unknown> {
  return request(path, { ...options, method: 'PATCH', body });
}

function del(path: string, options?: BodylessOptions): Promise<unknown> {
  return request(path, { ...options, method: 'DELETE' });
}

export const api = { get, post, patch, delete: del };

export { ApiError };
