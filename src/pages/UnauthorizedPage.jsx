import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore, { ROLES } from '../store/useAuthStore';

/**
 * UnauthorizedPage — Página 403: acceso denegado por rol insuficiente.
 * Muestra un CTA diferente según el rol actual del usuario.
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // Dashboard del usuario actual
  const dashboardMap = {
    [ROLES.CLIENT]:   { path: '/clientdashboard',   label: 'Mi Dashboard' },
    [ROLES.PROVIDER]: { path: '/providerdashboard', label: 'Mi Panel de Negocio' },
    [ROLES.ADMIN]:    { path: '/admindashboard',     label: 'Panel Admin' },
  };
  const dashboard = isAuthenticated
    ? dashboardMap[user?.role] ?? { path: '/', label: 'Inicio' }
    : { path: '/login', label: 'Iniciar Sesión' };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col items-center justify-center px-4 text-center">
      {/* Ícono animado */}
      <div className="text-7xl mb-6 animate-bounce" aria-hidden="true">🔒</div>

      {/* Badge de error */}
      <p className="text-sm font-bold tracking-widest text-brand-primary uppercase mb-3">
        Error 403
      </p>

      {/* Título */}
      <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
        Acceso restringido
      </h1>

      {/* Descripción */}
      <p className="text-gray-500 text-base max-w-md mb-3 leading-relaxed">
        No tienes permiso para ver esta página. Esta sección es exclusiva de otro
        tipo de cuenta.
      </p>

      {/* Info del rol actual */}
      {isAuthenticated && user && (
        <p className="text-sm font-medium text-gray-400 mb-10">
          Estás ingresado como:{' '}
          <span className="font-bold text-gray-600 capitalize">{user.role}</span>
          {' · '}{user.name}
        </p>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 font-bold rounded-pill transition-colors text-sm"
        >
          ← Volver atrás
        </button>
        <Link
          to={dashboard.path}
          className="px-8 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-pill transition-colors no-underline text-sm"
        >
          {dashboard.label}
        </Link>
      </div>
    </div>
  );
}
