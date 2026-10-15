/**
 * useAuthStore — Zustand store de autenticación para KunaPet (API real).
 *
 * Gestiona:
 *  - Sesión: { user, token } (lo ÚNICO que se persiste en localStorage)
 *  - Acciones: login, register, verifySession, logout, updateProfile
 *  - `sessionStatus`: 'verifying' mientras se valida el token guardado con GET /auth/me;
 *    'ready' cuando ya se sabe si hay sesión. ProtectedRoute espera a 'ready'.
 *
 * Seguridad: el token vive en localStorage (decisión de esta fase). Un XSS podría
 * leerlo; la alternativa son cookies httpOnly (ver README). No se registra en consola.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import * as authService from '../services/authService';
import { friendlyMessage } from '../api/errorMessages';
import { isApiError } from '../api/ApiError';
import { userSchema } from '../api/schemas';
import useCartStore from './useCartStore';
import usePetsStore from './usePetsStore';
import type { ApiErrorCode, Role, User } from '@/types/api';

// ─── Tipos de Roles ───────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT:   'client',
  PROVIDER: 'provider',
  ADMIN:    'admin',
} as const satisfies Record<string, Role>;

// ─── Tipos ────────────────────────────────────────────────────────────────────
/** 'verifying' mientras se valida el token guardado; 'ready' cuando ya se sabe si hay sesión. */
export type SessionStatus = 'verifying' | 'ready';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData extends Credentials {
  name: string;
  /** Solo 'client' o 'provider': el registro público nunca crea admins. */
  role: Exclude<Role, 'admin'>;
  phone?: string;
}

/** Resultado de login/register: unión discriminada por `success`. */
export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string; code?: ApiErrorCode };

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionStatus: SessionStatus;
  isLoading: boolean;
  error: string | null;
  /**
   * Mensaje cuando la verificación de la sesión guardada falló por algo que NO es un 401
   * (red, timeout, 5xx): la sesión se conserva y la pantalla de verificación ofrece «Reintentar».
   */
  verifyError: string | null;
}

interface AuthActions {
  login: (credentials: Credentials) => Promise<AuthResult>;
  /** Crea la cuenta (rol client o provider) e inicia sesión con las mismas credenciales. */
  register: (data: RegisterData) => Promise<AuthResult>;
  /**
   * Valida la sesión guardada con GET /auth/me (una sola petición aunque se llame dos veces).
   * Solo un 401 cierra la sesión; cualquier otro fallo la conserva (ver verifyError).
   */
  verifySession: () => Promise<void>;
  /** Limpia la sesión y los stores persistidos del carrito y de mascotas. */
  logout: () => void;
  /** Solo estado local; el endpoint llega en otra fase. */
  updateProfile: (partialUser: Partial<User>) => void;
  clearError: () => void;
  isClient: () => boolean;
  isProvider: () => boolean;
  isAdmin: () => boolean;
}

export type AuthStore = AuthState & AuthActions;

/** SOLO { user, token }: nunca isAuthenticated, isLoading ni errores. */
interface PersistedAuth {
  user: User | null;
  token: string | null;
}

// Lo guardado en localStorage no es de fiar: se valida antes de usarlo.
const persistedAuthSchema = z.object({ user: userSchema.nullable(), token: z.string().nullable() });

const initialSession = {
  user:            null,
  token:           null,
  isAuthenticated: false,
  sessionStatus:   'ready',
} as const satisfies Pick<AuthState, 'user' | 'token' | 'isAuthenticated' | 'sessionStatus'>;

// Un solo /auth/me en vuelo aunque React StrictMode monte dos veces.
let verifyInFlight: Promise<void> | null = null;

function resetPersistedStores(): void {
  useCartStore.setState({ items: [], isOpen: false });
  useCartStore.persist.clearStorage();
  usePetsStore.getState().reset();
}

function errorCode(err: unknown): ApiErrorCode | undefined {
  return isApiError(err) ? err.code : undefined;
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useAuthStore = create<AuthStore>()(
  persist<AuthStore, [], [], PersistedAuth>(
    (set, get) => ({
      ...initialSession,
      isLoading: false,
      error:     null,
      verifyError: null,

      // ── LOGIN ──────────────────────────────────────────────────────────────
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.login(credentials);
          set({ user, token, isAuthenticated: true, sessionStatus: 'ready', isLoading: false, error: null, verifyError: null });
          return { success: true, user };
        } catch (err) {
          const message = friendlyMessage(err, 'login');
          set({ isLoading: false, error: message });
          return { success: false, error: message, code: errorCode(err) };
        }
      },

      // ── REGISTER ───────────────────────────────────────────────────────────
      register: async ({ name, email, password, role, phone }) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register({ name, email, password, role, phone });
        } catch (err) {
          const message = friendlyMessage(err, 'register');
          set({ isLoading: false, error: message });
          return { success: false, error: message, code: errorCode(err) };
        }
        const result = await get().login({ email, password });
        return result.success
          ? result
          : { ...result, error: 'Tu cuenta se creó, pero no pudimos iniciar sesión. Inicia sesión manualmente.' };
      },

      // ── VERIFICAR SESIÓN (al cargar la app) ────────────────────────────────
      verifySession: () => {
        const { token } = get();
        if (!token) {
          set({ sessionStatus: 'ready' });
          return Promise.resolve();
        }
        if (verifyInFlight) return verifyInFlight;
        set({ sessionStatus: 'verifying', verifyError: null });
        verifyInFlight = authService
          .getProfile()
          .then(({ user }) => {
            set({ user, isAuthenticated: true, sessionStatus: 'ready', verifyError: null });
          })
          .catch((err: unknown) => {
            if (isApiError(err) && err.status === 401) {
              get().logout(); // el servidor dijo que el token ya no vale
            } else {
              // Red caída, timeout o 5xx: no sabemos si el token sirve, así que NO se cierra
              // la sesión; la pantalla de verificación ofrece reintentar.
              set({ verifyError: friendlyMessage(err) });
            }
          })
          .finally(() => {
            verifyInFlight = null;
          });
        return verifyInFlight;
      },

      // ── LOGOUT ─────────────────────────────────────────────────────────────
      logout: () => {
        set({ ...initialSession, isLoading: false, error: null, verifyError: null });
        resetPersistedStores();
      },

      updateProfile: (partialUser) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...partialUser } });
      },

      clearError: () => set({ error: null }),

      // ── SELECTORS (helpers) ────────────────────────────────────────────────
      isClient:   () => get().user?.role === ROLES.CLIENT,
      isProvider: () => get().user?.role === ROLES.PROVIDER,
      isAdmin:    () => get().user?.role === ROLES.ADMIN,
    }),
    {
      name:    'kunapet-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedAuth => ({ user: state.user, token: state.token }),
      // Con una sesión guardada, se arranca "verificando" hasta que /auth/me responda.
      merge: (persisted, current) => {
        const parsed = persistedAuthSchema.safeParse(persisted);
        if (!parsed.success || !parsed.data.user || !parsed.data.token) {
          return { ...current, user: null, token: null, isAuthenticated: false, sessionStatus: 'ready', verifyError: null };
        }
        return { ...current, user: parsed.data.user, token: parsed.data.token, isAuthenticated: true, sessionStatus: 'verifying', verifyError: null };
      },
    },
  ),
);

export default useAuthStore;
