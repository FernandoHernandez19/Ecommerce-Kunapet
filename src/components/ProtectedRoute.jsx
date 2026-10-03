/**
 * ProtectedRoute — Guard de rutas por autenticación y rol para KunaPet.
 *
 * Flujo:
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

export default function ProtectedRoute({
  children,
  allowedRoles = [],   // Array vacío = cualquier usuario autenticado puede acceder
}) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

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
  const { isAuthenticated, user } = useAuthStore();

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
