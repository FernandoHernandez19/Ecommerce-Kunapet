import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Inicio',     icon: '📊', href: '/clientdashboard' },
  { id: 'pets',      label: 'Mascotas',   icon: '🐾', href: '/add-pet' },
  { id: 'shop',      label: 'Tienda',     icon: '🛍️', href: '/marketplace' },
  { id: 'orders',    label: 'Pedidos',    icon: '📦', href: '/order-confirmation' },
  { id: 'profile',   label: 'Perfil',     icon: '👤', href: '#' },
];

/**
 * MobileNavigation — barra de navegación inferior fija para dispositivos móviles.
 * Solo visible en pantallas menores a lg (1024px).
 * Resalta el ítem activo según la ruta actual.
 */
export default function MobileNavigation() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 safe-area-inset-bottom"
      aria-label="Navegación móvil"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all no-underline ${
                isActive
                  ? 'text-brand-primary'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span
                className={`text-xl leading-none transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-semibold leading-none ${
                  isActive ? 'text-brand-primary' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-brand-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
