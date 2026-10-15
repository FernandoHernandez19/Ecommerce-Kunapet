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

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore, { ROLES } from '../store/useAuthStore';

// Pantalla mínima mientras se valida la sesión guardada con GET /auth/me:
// evita parpadeos y redirecciones prematuras a /login.
export function SessionChecking() {
  return (
    <div role="status" aria-live="polite" className="min-h-screen flex flex-col items-center justify-center gap-3 bg-surface-secondary">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-gray-500">Verificando tu sesión…</p>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],   // Array vacío = cualquier usuario autenticado puede acceder
}) {
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
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ── 3. Acceso concedido ──────────────────────────────────────────────────────
  return children;
}

// ─── Helper: redirect autenticado ────────────────────────────────────────────
// Úsalo en rutas como /login o /select-role para que un usuario ya logueado
// sea redirigido a su dashboard correspondiente en vez de ver el login de nuevo.
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user, sessionStatus } = useAuthStore();

  if (sessionStatus === 'verifying') return <SessionChecking />;

  if (!isAuthenticated) return children;

  // Redirigir al dashboard del rol correspondiente
  const dashboardMap = {
    [ROLES.CLIENT]:   '/clientdashboard',
    [ROLES.PROVIDER]: '/providerdashboard',
    [ROLES.ADMIN]:    '/admindashboard',
  };

  return (
    <Navigate
      to={dashboardMap[user?.role] ?? '/clientdashboard'}
      replace
    />
  );
}
