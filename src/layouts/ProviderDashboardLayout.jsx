import React from 'react';

export default function ProviderDashboardLayout({ children }) {
  const menuItems = [
    { name: 'Panel Principal', icon: '⊞', active: false },
    { name: 'Mis Servicios', icon: '🐾', active: true },
    { name: 'Pedidos', icon: '🛍️', active: false },
    { name: 'Agenda', icon: '📅', active: false },
    { name: 'Reseñas', icon: '⭐', active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-gray-800">
      {/* Sidebar - Traducido al español */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#F8F9FA] border-r border-gray-100 h-screen fixed top-0 left-0 z-20">
        <div className="p-8 flex flex-col items-center border-b border-gray-100">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" alt="Provider" className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-white" />
          <h2 className="text-lg font-bold text-[#006D44]">KunaPet Provider</h2>
          <p className="text-xs text-gray-500 font-medium">Gestión de Servicios</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                item.active 
                  ? 'bg-emerald-100/50 text-[#006D44] border-r-4 border-[#006D44]' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full bg-[#006D44] hover:bg-[#005233] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md">
            + Nuevo Servicio
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[#006D44] text-2xl">🐾</span>
            <span className="text-xl font-black text-[#006D44] tracking-tight">KunaPet</span>
          </div>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar servicios, pedidos..." 
                className="w-full bg-gray-50 border border-transparent hover:border-gray-200 text-sm rounded-full pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#006D44]/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-gray-400 hover:text-[#006D44] transition-colors">🔔</button>
            <button className="text-gray-400 hover:text-[#006D44] transition-colors">⚙️</button>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}