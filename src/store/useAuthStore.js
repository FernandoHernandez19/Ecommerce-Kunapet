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
import * as authService from '../services/authService';
import { friendlyMessage } from '../api/errorMessages';
import useCartStore from './useCartStore';
import usePetsStore from './usePetsStore';

// ─── Tipos de Roles ───────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT:   'client',
  PROVIDER: 'provider',
  ADMIN:    'admin',
};

const initialSession = {
  user:            null,
  token:           null,
  isAuthenticated: false,
  sessionStatus:   'ready',
};

// Un solo /auth/me en vuelo aunque React StrictMode monte dos veces.
let verifyInFlight = null;

function resetPersistedStores() {
  useCartStore.setState({ items: [], isOpen: false });
  useCartStore.persist.clearStorage();
  usePetsStore.setState(usePetsStore.getInitialState(), true);
  usePetsStore.persist.clearStorage();
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialSession,
      isLoading: false,
      error:     null,

      // ── LOGIN ──────────────────────────────────────────────────────────────
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.login(credentials);
          set({ user, token, isAuthenticated: true, sessionStatus: 'ready', isLoading: false, error: null });
          return { success: true, user };
        } catch (err) {
          const message = friendlyMessage(err, 'login');
          set({ isLoading: false, error: message });
          return { success: false, error: message, code: err?.code };
        }
      },

      // ── REGISTER ───────────────────────────────────────────────────────────
      // Crea la cuenta (rol client o provider) e inicia sesión con las mismas credenciales.
      register: async ({ name, email, password, role, phone }) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register({ name, email, password, role, phone });
        } catch (err) {
          const message = friendlyMessage(err, 'register');
          set({ isLoading: false, error: message });
          return { success: false, error: message, code: err?.code };
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
        set({ sessionStatus: 'verifying' });
        verifyInFlight = authService
          .getProfile()
          .then(({ user }) => set({ user, isAuthenticated: true, sessionStatus: 'ready' }))
          .catch(() => get().logout()) // cualquier fallo cierra la sesión
          .finally(() => {
            verifyInFlight = null;
          });
        return verifyInFlight;
      },

      // ── LOGOUT ─────────────────────────────────────────────────────────────
      // Limpia la sesión y los stores persistidos del carrito y de mascotas.
      logout: () => {
        set({ ...initialSession, isLoading: false, error: null });
        resetPersistedStores();
      },

      // ── UPDATE PROFILE (solo estado local; el endpoint llega en otra fase) ──
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
      // SOLO { user, token }: nunca isAuthenticated, isLoading ni errores.
      partialize: (state) => ({ user: state.user, token: state.token }),
      // Con una sesión guardada, se arranca "verificando" hasta que /auth/me responda.
      merge: (persisted, current) => {
        const hasSession = Boolean(persisted?.user && persisted?.token);
        return {
          ...current,
          user:            hasSession ? persisted.user : null,
          token:           hasSession ? persisted.token : null,
          isAuthenticated: hasSession,
          sessionStatus:   hasSession ? 'verifying' : 'ready',
        };
      },
    }
  )
);

export default useAuthStore;
