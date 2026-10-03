import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Menu, X,
  ChevronDown, LayoutDashboard, ShoppingBag,
  Settings, LogOut, UserCircle2,
} from 'lucide-react';
import BrandImage from '../assets/Kunapet.png';
import { Avatar, Badge } from './ui';
import useAuthStore, { ROLES } from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import CartDrawer from './CartDrawer';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DASHBOARD_BY_ROLE = {
  [ROLES.CLIENT]: '/clientdashboard',
  [ROLES.PROVIDER]: '/providerdashboard',
  [ROLES.ADMIN]: '/admindashboard',
};

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Ayuda', to: '/help-center' },
];

// ─── Sub-componente: SearchBar ────────────────────────────────────────────────
function SearchBar({ className = '', inputClassName = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/marketplace?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`} role="search">
      <div className="relative flex-grow">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar servicios, comida, juguetes..."
          aria-label="Buscar en KunaPet"
          className={[
            'w-full pl-10 pr-4 py-2 text-sm rounded-pill bg-white',
            'border border-surface-border',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary',
            'transition-all',
            inputClassName,
          ].join(' ')}
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 rounded-pill bg-brand-secondary hover:bg-brand-secondary-hover text-white text-sm font-semibold transition-colors shrink-0"
      >
        Buscar
      </button>
    </form>
  );
}

// ─── Sub-componente: CartButton ────────────────────────────────────────────────
function CartButton() {
  const { totalItems, toggleCart } = useCartStore();
  const count = typeof totalItems === 'function' ? totalItems() : 0;

  // Zustand getters are computed, access via direct call when using vanilla getters
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      aria-label={`Carrito de compras${itemCount > 0 ? `, ${itemCount} items` : ', vacío'}`}
      className="relative p-2 text-gray-600 hover:text-brand-primary hover:bg-brand-primary-light rounded-xl transition-all"
    >
      <ShoppingCart size={22} />
      {itemCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-black px-1 border-2 border-white"
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}

// ─── Sub-componente: UserMenu (dropdown del perfil) ────────────────────────────
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const dashboardPath = DASHBOARD_BY_ROLE[user?.role] ?? '/clientdashboard';
  const roleBadge = {
    [ROLES.CLIENT]: { label: 'Cliente', variant: 'primary' },
    [ROLES.PROVIDER]: { label: 'Proveedor', variant: 'accent' },
    [ROLES.ADMIN]: { label: 'Admin', variant: 'danger' },
  }[user?.role] ?? { label: 'Usuario', variant: 'gray' };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menú de usuario"
        className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-gray-100 transition-all"
      >
        <Avatar src={user?.avatar} name={user?.name} size="sm" online />
        <span className="hidden xl:block text-sm font-bold text-gray-800 max-w-[120px] truncate">
          {user?.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Opciones de cuenta"
          className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-modal border border-surface-border-light overflow-hidden z-50 animate-fade-in-scale"
        >
          {/* Header del dropdown */}
          <div className="px-4 py-3 border-b border-surface-border-light bg-surface-secondary">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sesión activa</p>
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate mb-1.5">{user?.email}</p>
            <Badge variant={roleBadge.variant} size="sm">{roleBadge.label}</Badge>
          </div>

          {/* Items del menú */}
          <div className="py-1.5">
            <Link
              to={dashboardPath}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
            >
              <LayoutDashboard size={16} className="text-gray-400" aria-hidden="true" />
              Mi Dashboard
            </Link>
            <button
              role="menuitem"
              onClick={() => { setOpen(false); navigate('/clientdashboard', { state: { tab: 'orders' } }); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left"
            >
              <ShoppingBag size={16} className="text-gray-400" aria-hidden="true" />
              Mis Pedidos
            </button>
            <button
              role="menuitem"
              onClick={() => { setOpen(false); navigate('/clientdashboard', { state: { tab: 'settings' } }); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left"
            >
              <Settings size={16} className="text-gray-400" aria-hidden="true" />
              Configuración
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-surface-border-light py-1.5">
            <button
              role="menuitem"
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
            >
              <LogOut size={16} aria-hidden="true" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function NavbarHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-30 shadow-card">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0 no-underline" aria-label="KunaPet — Ir al inicio">
            <span className="text-2xl font-black text-emerald-800 tracking-tight">KunaPet</span>
          </Link>

          {/* ── Barra de búsqueda (desktop) ── */}
          <SearchBar className="hidden lg:flex flex-1 mx-4" />

          {/* ── Navegación (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all no-underline"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Carrito + Sesión (desktop) ── */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <CartButton />

            {isAuthenticated && user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-brand-primary hover:bg-brand-primary-light rounded-xl transition-all no-underline"
                >
                  Ingresar
                </Link>
                <Link
                  to="/select-role"
                  className="px-4 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-pill shadow-brand-sm transition-all no-underline"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>

          {/* ── Botón hamburguesa (mobile) ── */}
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            <CartButton />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Menú Mobile ── */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-surface-border pt-4 space-y-4 animate-slide-up">
            {/* Búsqueda mobile */}
            <SearchBar inputClassName="bg-surface-secondary" />

            {/* Links */}
            <nav className="space-y-1" aria-label="Navegación móvil">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all no-underline"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Sesión mobile */}
            <div className="border-t border-surface-border pt-3 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to={DASHBOARD_BY_ROLE[user?.role] ?? '/clientdashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl no-underline"
                  >
                    <LayoutDashboard size={16} className="text-gray-400" />
                    Mi Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl no-underline"
                  >
                    <UserCircle2 size={16} className="text-gray-400" />
                    Ingresar
                  </Link>
                  <Link
                    to="/select-role"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-xl no-underline transition-colors"
                  >
                    Crear cuenta gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drawer del carrito, global a toda la app cuando el Navbar está visible */}
      <CartDrawer />
    </header>
  );
}