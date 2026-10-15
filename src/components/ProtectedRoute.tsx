/**
 * ProtectedRoute — Guard de rutas por autenticación y rol para KunaPet.
 *
 * Flujo:
 *  0. Mientras se valida la sesión guardada (GET /auth/me) muestra "verificando"
 *  1. Si el usuario NO está autenticado → redirige a /login
 *     (guarda la ruta original en state para redirigir de vuelta tras login)
 *  2. Si está autenticado pero su rol NO coincide → redirige a /unauthorized
 *  3. Si todo está OK → renderiza la página solicitada
 *
 * Uso en App.jsx:
 *
 *   // Solo autenticado (cualquier rol):
 *   <Route path="/checkout" element={
 *     <ProtectedRoute>
 *       <CheckoutPage />
 *     </ProtectedRoute>
 *   } />
 *
 *   // Solo rol específico:
 *   <Route path="/admindashboard" element={
 *     <ProtectedRoute allowedRoles={['admin']}>
 *       <AdminDashboard />
 *     </ProtectedRoute>
 *   } />
 *
 *   // Múltiples roles:
 *   <Route path="/service-management" element={
 *     <ProtectedRoute allowedRoles={['provider', 'admin']}>
 *       <ServiceManagementPage />
 *     </ProtectedRoute>
 *   } />
 */

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore, { ROLES } from '../store/useAuthStore';
import type { Role } from '@/types/api';

// Pantalla mínima mientras se valida la sesión guardada con GET /auth/me:
// evita parpadeos y redirecciones prematuras a /login. Si la verificación falló por un
// problema que no es de credenciales (red, timeout, 5xx) la sesión se conserva y aquí se
// ofrece «Reintentar». Mientras la petición tarda, el aviso global de «servidor
// despertando» (ServerWakingNotice) se muestra solo.
export function SessionChecking(): ReactNode {
  const verifyError = useAuthStore((s) => s.verifyError);
  const verifySession = useAuthStore((s) => s.verifySession);

  return (
    <div role="status" aria-live="polite" className="min-h-screen flex flex-col items-center justify-center gap-3 bg-surface-secondary px-4 text-center">
      {verifyError ? (
        <>
          <p role="alert" className="text-sm font-medium text-gray-700 max-w-sm">
            No pudimos verificar tu sesión. {verifyError}
          </p>
          <button
            type="button"
            onClick={() => void verifySession()}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold rounded-xl transition-colors"
          >
            Reintentar
          </button>
        </>
      ) : (
        <>
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-500">Verificando tu sesión…</p>
        </>
      )}
    </div>
  );
}

interface ProtectedRouteProps {
  children: ReactNode;
  /** Array vacío = cualquier usuario autenticado puede acceder. */
  allowedRoles?: readonly Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps): ReactNode {
  const { isAuthenticated, user, sessionStatus } = useAuthStore();
  const location = useLocation();

  // ── 0. Verificando la sesión guardada ────────────────────────────────────────
  if (sessionStatus === 'verifying') return <SessionChecking />;

  // ── 1. No autenticado ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}   // Permite redirigir de vuelta tras login
        replace
      />
    );
  }

  // ── 2. Rol no permitido ──────────────────────────────────────────────────────
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ── 3. Acceso concedido ──────────────────────────────────────────────────────
  return children;
}

// ─── Helper: redirect autenticado ────────────────────────────────────────────
// Úsalo en rutas como /login o /select-role para que un usuario ya logueado
// sea redirigido a su dashboard correspondiente en vez de ver el login de nuevo.
export function PublicOnlyRoute({ children }: { children: ReactNode }): ReactNode {
  const { isAuthenticated, user, sessionStatus } = useAuthStore();

  if (sessionStatus === 'verifying') return <SessionChecking />;

  if (!isAuthenticated) return children;

  // Redirigir al dashboard del rol correspondiente
  const dashboardMap: Readonly<Record<Role, string>> = {
    [ROLES.CLIENT]:   '/clientdashboard',
    [ROLES.PROVIDER]: '/providerdashboard',
    [ROLES.ADMIN]:    '/admindashboard',
  };

  return (
    <Navigate
      to={user ? dashboardMap[user.role] : '/clientdashboard'}
      replace
    />
  );
}
