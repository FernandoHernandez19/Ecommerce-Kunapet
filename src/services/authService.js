/**
 * authService — Autenticación contra la API real de KunaPet (docs/api-contract.md §3).
 *
 * Los errores llegan como ApiError (src/api/ApiError.js); la traducción a mensajes
 * para el usuario vive en src/api/errorMessages.js.
 */
import { api } from '../api/client';

// Estas llamadas manejan sus propios errores: un 401 aquí NO es "sesión expirada".
const NO_SESSION_REDIRECT = { handleUnauthorized: false };

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, token: string, expiresIn: number }>}
 */
export function login({ email, password }) {
  return api.post('/auth/login', { email: email.trim(), password }, { auth: false, ...NO_SESSION_REDIRECT });
}

/**
 * POST /auth/register — el rol solo puede ser 'client' o 'provider'.
 * @param {{ name: string, email: string, password: string, role: 'client'|'provider', phone?: string }} data
 * @returns {Promise<{ user: object }>}
 */
export function register({ name, email, password, role, phone }) {
  const body = { name: name.trim(), email: email.trim(), password, role };
  if (phone && phone.trim()) body.phone = phone.trim();
  return api.post('/auth/register', body, { auth: false, ...NO_SESSION_REDIRECT });
}

/**
 * GET /auth/me — perfil del usuario del token actual.
 * @returns {Promise<{ user: object }>}
 */
export function getProfile() {
  return api.get('/auth/me', NO_SESSION_REDIRECT);
}
