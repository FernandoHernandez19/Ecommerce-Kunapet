/**
 * useAuthStore — Zustand store de autenticación para KunaPet.
 *
 * Gestiona:
 *  - Estado de sesión del usuario (cliente / proveedor / admin)
 *  - Token JWT (listo para integración con el API de C#)
 *  - Acciones: login, logout, updateProfile
 *  - Persistencia en localStorage (persist middleware de Zustand)
 *
 * Cuando el backend esté listo, solo hay que cambiar las funciones
 * de acción para llamar al API real — el resto de la app no cambia.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authService from '../services/authService';

// ─── Tipos de Roles ───────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT:   'client',
  PROVIDER: 'provider',
  ADMIN:    'admin',
};

// ─── Estado inicial ───────────────────────────────────────────────────────────
const INITIAL_STATE = {
  user:            null,   // Objeto del usuario autenticado
  token:           null,   // JWT token (string)
  isAuthenticated: false,  // Booleano derivado de user/token
  isLoading:       false,  // Para estados de carga en formularios
  error:           null,   // Mensaje de error del último intento
};

// ─── Store ────────────────────────────────────────────────────────────────────
const useAuthStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ── LOGIN ──────────────────────────────────────────────────────────────
      // TODO: Cuando el API de C# esté listo, reemplazar el bloque
      //       de mock por: const res = await authService.login(credentials);
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // ── MOCK: simula delay de red ──────────────────────────────────────
          await new Promise((r) => setTimeout(r, 800));

          // Mock de respuesta del servidor según el email ingresado
          const roleMap = {
            'admin@kunapet.com':    ROLES.ADMIN,
            'proveedor@kunapet.com': ROLES.PROVIDER,
          };
          const role = roleMap[credentials.email] ?? ROLES.CLIENT;

          const mockUser = {
            id:        'usr-001',
            email:     credentials.email,
            name:      role === ROLES.ADMIN ? 'Fernando H.' : role === ROLES.PROVIDER ? 'PetShop Central' : 'Camila R.',
            role,
            avatar:    null,
            createdAt: new Date().toISOString(),
          };
          const mockToken = `mock-jwt-token-${role}-${Date.now()}`;
          // ── Fin MOCK ───────────────────────────────────────────────────────

          set({
            user:            mockUser,
            token:           mockToken,
            isAuthenticated: true,
            isLoading:       false,
            error:           null,
          });

          return { success: true, user: mockUser };
        } catch (err) {
          const errorMessage = err?.message ?? 'Error al iniciar sesión. Intenta de nuevo.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // ── LOGOUT ─────────────────────────────────────────────────────────────
      logout: () => {
        set({ ...INITIAL_STATE });
        // Nota: zustand/persist limpiará localStorage automáticamente
      },

      // ── UPDATE PROFILE ─────────────────────────────────────────────────────
      updateProfile: (partialUser) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...partialUser } });
      },

      // ── CLEAR ERROR ────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),

      // ── SELECTORS (helpers) ────────────────────────────────────────────────
      isClient:   () => get().user?.role === ROLES.CLIENT,
      isProvider: () => get().user?.role === ROLES.PROVIDER,
      isAdmin:    () => get().user?.role === ROLES.ADMIN,
    }),
    {
      name:    'kunapet-auth',           // Clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir lo necesario (no isLoading ni error)
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
