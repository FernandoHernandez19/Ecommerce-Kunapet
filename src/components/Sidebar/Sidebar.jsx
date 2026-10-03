import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'dashboard', label: 'Panel Principal', icon: '📊', href: '/clientdashboard' },
  { id: 'pets', label: 'Mis Mascotas', icon: '🐾', href: '/pet-dashboard' },
  { id: 'orders', label: 'Mis Pedidos', icon: '🛍️', href: '/order-confirmation' },
  { id: 'messages', label: 'Mensajes', icon: '💬', href: '#' },
  { id: 'settings', label: 'Configuración', icon: '⚙️', href: '#' },
];

export default function Sidebar({ user }) {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed top-0 left-0 z-20 p-5 justify-between">
      <div className="space-y-8">
        {/* Marca / Logo */}
        <Link to="/" className="flex items-center px-2 no-underline">
          <span className="text-2xl font-black text-emerald-800 tracking-tight">KunaPet</span>
        </Link>

        {/* Mini Perfil del Cliente */}
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-2xl border border-gray-100/50">
          <img
            src={user?.avatar}
            alt={user?.clientName ?? 'Usuario'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">¡Bienvenido!</p>
            <p className="text-sm font-bold text-gray-900">{user?.clientName ?? '—'}</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1.5" aria-label="Navegación principal">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all no-underline ${isActive
                  ? 'bg-emerald-100 text-emerald-950 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className="text-base" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* CTA y Cierre de Sesión */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <Link
          to="/marketplace"
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md text-sm transition-all text-center block active:scale-[0.99] no-underline"
        >
          Reservar Servicio
        </Link>

        <div className="space-y-1 text-xs font-semibold text-gray-500">
          <Link
            to="/help-center"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg hover:text-gray-900 transition-all no-underline text-gray-500"
          >
            <span aria-hidden="true">❓</span>
            <span>Centro de Ayuda</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 rounded-lg hover:text-red-600 text-red-500 transition-all no-underline"
          >
            <span aria-hidden="true">🚪</span>
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
