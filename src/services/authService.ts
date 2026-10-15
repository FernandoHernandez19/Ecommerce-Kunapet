/**
 * authService — Autenticación contra la API real de KunaPet (docs/api-contract.md §3).
 *
 * Cada respuesta se valida con zod (src/api/schemas.ts) antes de usarse: si el servidor
 * responde algo que no cumple el contrato, el cliente lanza ApiError "invalid_response".
 * Los errores llegan como ApiError (src/api/ApiError.ts); la traducción a mensajes
 * para el usuario vive en src/api/errorMessages.ts.
 */
import { api } from '../api/client';
import { loginResponseSchema, userEnvelopeSchema } from '../api/schemas';
import type { LoginResponse, Role, User } from '@/types/api';

// Estas llamadas manejan sus propios errores: un 401 aquí NO es "sesión expirada".
const NO_SESSION_REDIRECT = { handleUnauthorized: false } as const;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
  /** El registro público solo permite client o provider. */
  role: Exclude<Role, 'admin'>;
  phone?: string | undefined;
}

/** POST /auth/login */
export function login({ email, password }: LoginInput): Promise<LoginResponse> {
  return api.post('/auth/login', { email: email.trim(), password }, { auth: false, ...NO_SESSION_REDIRECT, schema: loginResponseSchema });
}

/** POST /auth/register */
export function register({ name, email, password, role, phone }: RegisterInput): Promise<{ user: User }> {
  const body = { name: name.trim(), email: email.trim(), password, role, ...(phone?.trim() ? { phone: phone.trim() } : {}) };
  return api.post('/auth/register', body, { auth: false, ...NO_SESSION_REDIRECT, schema: userEnvelopeSchema });
}

/** GET /auth/me — perfil del usuario del token actual. */
export function getProfile(): Promise<{ user: User }> {
  return api.get('/auth/me', { ...NO_SESSION_REDIRECT, schema: userEnvelopeSchema });
}
