import React from 'react';

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Aprobaciones', icon: '🛡️', active: false },
    { name: 'Gestión de Usuarios', icon: '👥', active: false },
    { name: 'Categorías', icon: '🗂️', active: false },
    { name: 'Configuración', icon: '⚙️', active: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#F9FAFB] border-r border-gray-200 h-screen fixed top-0 left-0 z-20 justify-between">
      <div className="py-6 space-y-6">
        <div className="px-6">
          <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">KunaPet <span className="font-medium">Admin</span></h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Marketplace Control</p>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center space-x-3 px-6 py-3 text-sm font-semibold transition-all border-l-4 ${
                item.active 
                  ? 'bg-red-50 border-brand-primary text-emerald-900' 
                  : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6 space-y-4 border-t border-gray-200 bg-[#F9FAFB]">
        <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm">
          Generar Reportes
        </button>
        <div className="space-y-2 pt-2">
          <button className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-2 w-full">
            <span>❓</span> <span>Centro de Ayuda</span>
          </button>
          <button className="flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg w-full transition-colors">
            <span>🚪</span> <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}