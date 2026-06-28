import React from 'react';

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Panel Principal', icon: '⊞', active: false },
    { name: 'Tickets Activos', icon: '🎫', active: false },
    { name: 'Cola de Reclamos', icon: '⚖️', active: true },
    { name: 'Casos Resueltos', icon: '✅', active: false },
  ];

  return (
    <aside className="w-64 bg-[#F8F9FA] border-r border-gray-200 h-screen fixed top-0 left-0 flex flex-col justify-between">
      <div className="py-8 space-y-8">
        <div className="px-8">
          <h1 className="text-2xl font-bold text-[#e23d28] tracking-tight">Portal Admin</h1>
          <p className="text-[11px] text-gray-500 font-semibold mt-1 uppercase tracking-wider">Gestión de Reclamos</p>
        </div>
        
        <nav className="space-y-2 px-4">
          {menuItems.map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                item.active 
                  ? 'bg-emerald-200/50 text-[#e23d28]' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6 space-y-6">
        <button className="flex items-center space-x-3 text-sm font-semibold text-gray-600 hover:text-gray-900 w-full px-2 transition-colors">
          <span className="text-lg">⚙️</span>
          <span>Configuración</span>
        </button>
        
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" alt="Admin" className="w-10 h-10 rounded-full border border-gray-300" />
            <div>
              <p className="text-sm font-bold text-gray-900">Usuario Admin</p>
              <p className="text-[11px] text-gray-500 font-medium">Perfil Admin</p>
            </div>
          </div>
          <button className="w-full bg-[#e23d28] hover:bg-[#c93623] text-white font-bold py-2.5 px-4 rounded-full text-sm transition-all shadow-md">
            + Nuevo Reporte
          </button>
        </div>
      </div>
    </aside>
  );
}