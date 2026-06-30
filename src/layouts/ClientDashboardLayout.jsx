import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PawPrint, CalendarCheck, ShoppingBag,
  MessageSquare, Settings, HelpCircle, LogOut, Search,
  ChevronDown, Bell, User, X, CheckCircle, AlertTriangle, Info, Star
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { mockNotifications } from '../data/mockData';

const ACCENT = '#2D6A4F';

// ─── Items de navegación principal ───────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home', label: 'Panel Principal', Icon: LayoutDashboard },
  { id: 'pets', label: 'Mis Mascotas', Icon: PawPrint },
  { id: 'reservations', label: 'Mis Reservas', Icon: CalendarCheck },
  { id: 'orders', label: 'Mis Pedidos', Icon: ShoppingBag },
  { id: 'messages', label: 'Mensajes', Icon: MessageSquare },
  { id: 'reviews', label: 'Mis Reseñas', Icon: Star },
  { id: 'settings', label: 'Configuración', Icon: Settings },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ activeView, setActiveView, user, unreadCount }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed top-0 left-0 z-20 p-5">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-2 mb-8 no-underline shrink-0">
        <PawPrint size={22} strokeWidth={2} style={{ color: ACCENT }} />
        <span className="text-xl font-black tracking-tight" style={{ color: ACCENT }}>KunaPet</span>
      </Link>

      {/* Mini perfil */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-6 shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: ACCENT }}>
          {user?.name?.[0] ?? 'C'}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-semibold">Bienvenida</p>
          <p className="text-sm font-bold text-gray-900 truncate">{user?.name ?? 'Cliente'}</p>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left w-full ${isActive ? '' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              style={isActive ? {
                backgroundColor: `${ACCENT}15`,
                color: ACCENT,
              } : {}}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="flex-1">{label}</span>
              {id === 'messages' && unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: ayuda + logout */}
      <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-1 shrink-0">
        <Link
          to="/help-center"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all no-underline"
        >
          <HelpCircle size={16} strokeWidth={1.5} />
          <span>Centro de Ayuda</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all text-left w-full"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Navbar Superior ──────────────────────────────────────────────────────────
function TopNavbar({ user }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-100 z-10 flex items-center px-6 gap-4">
      {/* Buscador */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar mascotas, servicios, pedidos…"
          className="w-full bg-gray-100 border border-transparent rounded-xl pl-9 pr-4 py-2.5 text-sm
            focus:outline-none focus:bg-white focus:border-gray-200 transition-all text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Notificaciones */}
      <div className="relative" ref={notifRef}>
        <button 
          onClick={() => setNotifOpen((p) => !p)}
          className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
        >
          <Bell size={18} strokeWidth={1.5} />
          {notifications.some(n => n.isUnread) && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[var(--shadow-card-hover)] border border-gray-100 overflow-hidden z-50 animate-slide-up">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Notificaciones</h3>
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                Marcar leídas
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${notif.isUnread ? 'bg-blue-50/30' : ''}`}>
                  <div className="shrink-0 mt-0.5">
                    {notif.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
                    {notif.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
                    {notif.type === 'info' && <Info size={18} className="text-blue-500" />}
                  </div>
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className={`text-sm font-bold ${notif.isUnread ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</p>
                      <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-100">
              <button className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">
                Ver todas
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Dropdown usuario */}
      {/*
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setDropOpen((p) => !p)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: ACCENT }}>
            {user?.name?.[0] ?? 'C'}
          </div>
          <span className="text-sm font-semibold text-gray-800 hidden md:block">
            {user?.name?.split(' ')[0] ?? 'Cliente'}
          </span>
          <ChevronDown size={14} strokeWidth={2} className="text-gray-400" />
        </button>

        {dropOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[var(--shadow-card-hover)] border border-gray-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-xs text-gray-400 font-medium">Conectado como</p>
              <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
            </div>
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all">
              <User size={15} strokeWidth={1.5} /> Mi Perfil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={15} strokeWidth={1.5} /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
      
      */}

    </header>
  );
}

// ─── Layout Principal ─────────────────────────────────────────────────────────
export default function ClientDashboardLayout({ children, activeView, setActiveView, user, unreadCount = 0 }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        unreadCount={unreadCount}
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <TopNavbar user={user} />
        <main className="flex-1 pt-16 px-6 pb-6 lg:px-8 lg:pb-8 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
