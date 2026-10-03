import React from 'react';

export default function AdminTopNav({ adminName, avatarUrl }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 border-b border-gray-100">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-primary transition-colors">
            🔍
          </span>
          <input 
            type="text" 
            placeholder="Buscar usuarios, proveedores o reportes..." 
            className="w-full bg-gray-50/50 hover:bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
        </div>
      </div>
      <div className="flex items-center space-x-5 ml-4">
        <button className="relative text-gray-500 hover:text-brand-primary transition-colors">
          <span className="text-xl">🔔</span>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="text-gray-500 hover:text-brand-primary transition-colors text-xl">
          ⊞
        </button>
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        <button className="flex items-center hover:opacity-80 transition-opacity">
          <img src={avatarUrl} alt={adminName} className="w-9 h-9 rounded-full object-cover shadow-sm" />
        </button>
      </div>
    </header>
  );
}