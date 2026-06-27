import React from 'react';

const menuItems = [
  { id: 'dashboard', label: 'Panel Principal', icon: '📊', active: true },
  { id: 'pets', label: 'Mis Mascotas', icon: '🐾' },
  { id: 'orders', label: 'Mis Pedidos', icon: '🛍️' },
  { id: 'messages', label: 'Mensajes', icon: '💬' },
  { id: 'settings', label: 'Configuración', icon: '⚙️' },
];

export default function Sidebar({ user }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed top-0 left-0 z-20 p-5 justify-between">
      <div className="space-y-8">
        {/* Marca / Logo */}
        <div className="flex items-center px-2">
          <span className="text-2xl font-black text-emerald-800 tracking-tight">KunaPet</span>
        </div>

        {/* Mini Perfil del Cliente */}
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-2xl border border-gray-100/50">
          <img src={user?.avatar} alt={user?.clientName} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">¡Bienvenido!</p>
            <p className="text-sm font-bold text-gray-900">Camila</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={`/${item.id}`}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                item.active
                  ? 'bg-emerald-100 text-emerald-950 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* CTA y Enlaces de Cierre */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md text-sm transition-all text-center block active:scale-[0.99]">
          Reservar Servicio
        </button>

        <div className="space-y-1 text-xs font-semibold text-gray-500">
          <a href="/ayuda" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg hover:text-gray-900 transition-all">
            <span>❓</span> <span>Centro de Ayuda</span>
          </a>
          <a href="/logout" className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 rounded-lg hover:text-red-600 text-red-500 transition-all">
            <span>🚪</span> <span>Cerrar Sesión</span>
          </a>
        </div>
      </div>
    </aside>
  );
}