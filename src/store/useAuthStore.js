/**
 * useAuthStore — Zustand store de autenticación para KunaPet (API real).
 *
 * Gestiona:
 *  - Sesión: { user, token } (lo ÚNICO que se persiste en localStorage)
 *  - Acciones: login, register, logout, updateProfile
 *
 * Seguridad: el token vive en localStorage (decisión de esta fase). Un XSS podría
 * leerlo; la alternativa son cookies httpOnly (ver README). No se registra en consola.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authService from '../services/authService';
import { friendlyMessage } from '../api/errorMessages';

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
};

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
          set({ user, token, isAuthenticated: true, isLoading: false, error: null });
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

      // ── LOGOUT ─────────────────────────────────────────────────────────────
      logout: () => {
        set({ ...initialSession, isLoading: false, error: null });
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
      // isAuthenticated se deriva de lo persistido; no se guarda.
      merge: (persisted, current) => {
        const hasSession = Boolean(persisted?.user && persisted?.token);
        return {
          ...current,
          user:            hasSession ? persisted.user : null,
          token:           hasSession ? persisted.token : null,
          isAuthenticated: hasSession,
        };
      },
    }
  )
);

export default useAuthStore;
