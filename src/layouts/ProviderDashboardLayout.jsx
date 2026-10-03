/**
 * ProviderDashboardLayout — Layout del área de gestión del proveedor en KunaPet.
 *
 * Extiende ProviderLayout con:
 *  - Navegación con iconos reales (Lucide) en lugar de ⏺ placeholder
 *  - Links activos usando useLocation de React Router
 *  - Integración con useAuthStore para datos reales del proveedor
 *  - Avatar con fallback desde el componente ui/Avatar
 *  - Sidebar responsive con toggle en mobile
 *
 * Usado por: ServiceManagementPage y futuras páginas del área de proveedor.
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  CalendarDays,
  Star,
  BarChart2,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Search,
} from 'lucide-react';
import { Avatar } from '../components/ui';
import useAuthStore from '../store/useAuthStore';

// ─── Items del menú de navegación ────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Panel Principal', icon: LayoutDashboard, href: '/providerdashboard' },
  { label: 'Mis Servicios',   icon: Briefcase,       href: '/service-management' },
  { label: 'Pedidos',         icon: ShoppingBag,     href: '#' },
  { label: 'Agenda',          icon: CalendarDays,    href: '#' },
  { label: 'Reseñas',         icon: Star,            href: '#' },
  { label: 'Analíticas',      icon: BarChart2,       href: '#' },
];

// ─── Componente Sidebar ───────────────────────────────────────────────────────
function ProviderSidebar({ isOpen, onClose, user }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-screen w-64 z-40',
          'bg-surface-tertiary border-r border-surface-border',
          'flex flex-col justify-between',
          'transition-transform duration-300',
          // Mobile: oculto por defecto, visible cuando isOpen
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: siempre visible
          'lg:translate-x-0',
        ].join(' ')}
      >
        {/* Top Section */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Logo + close (mobile) */}
          <div className="flex items-center justify-between">
            <Link to="/providerdashboard" className="no-underline">
              <h1 className="text-xl font-black text-brand-secondary leading-tight">
                KunaPet<br />
                <span className="text-sm font-semibold text-gray-500">Business</span>
              </h1>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mini perfil del proveedor */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-surface-border-light shadow-card">
              <Avatar src={user.avatar} name={user.name} size="sm" online />
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Proveedor</p>
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              </div>
            </div>
          )}

          {/* Navegación principal */}
          <nav className="space-y-1" aria-label="Navegación del proveedor">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = location.pathname === href;
              return (
                <Link
                  key={href + label}
                  to={href}
                  onClick={onClose}
                  className={[
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl',
                    'text-sm font-semibold transition-all no-underline',
                    isActive
                      ? 'bg-brand-secondary-light text-brand-secondary shadow-sm'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900',
                  ].join(' ')}
                >
                  <Icon size={18} className="shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 space-y-3 border-t border-surface-border">
          <Link
            to="/marketplace"
            className={[
              'flex items-center gap-2 w-full',
              'bg-brand-secondary hover:bg-brand-secondary-hover',
              'text-white font-bold py-2.5 px-4 rounded-xl text-sm',
              'transition-all shadow-emerald no-underline',
            ].join(' ')}
          >
            <TrendingUp size={16} />
            Mejorar Plan
          </Link>
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
function ProviderTopNav({ onMenuOpen, user }) {
  return (
    <header className="h-16 bg-surface-secondary border-b border-surface-border flex items-center justify-between px-6 z-10 shrink-0">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Buscar servicios o clientes..."
            className="w-full bg-white border border-surface-border text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition"
            aria-label="Buscar"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notificaciones */}
        <button
          className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"
            aria-hidden="true"
          />
        </button>

        {/* Ayuda */}
        <Link
          to="/help-center"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Centro de ayuda"
        >
          <HelpCircle size={20} />
        </Link>

        {/* Configuración */}
        <button
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Configuración"
        >
          <Settings size={20} />
        </button>

        {/* Perfil */}
        {user && (
          <div className="flex items-center gap-2.5 pl-4 border-l border-surface-border">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <span className="text-sm font-bold text-gray-900 hidden xl:block">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Layout Principal ─────────────────────────────────────────────────────────
export default function ProviderDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-screen bg-surface-secondary font-sans text-gray-800">
      {/* Sidebar */}
      <ProviderSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main content area (offset for fixed sidebar on lg) */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <ProviderTopNav
          onMenuOpen={() => setSidebarOpen(true)}
          user={user}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}