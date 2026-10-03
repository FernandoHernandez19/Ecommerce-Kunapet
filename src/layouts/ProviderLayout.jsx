import React from 'react';

export default function ProviderLayout({ children, businessName, avatar }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      {/* Sidebar (Navegación Lateral) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#F5F4F0] border-r border-gray-200 h-screen fixed top-0 left-0 z-20 justify-between">
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800 leading-tight">KunaPet<br/>Business</h1>
            <p className="text-xs text-gray-500 mt-1">Gestiona tu negocio</p>
          </div>
          
          <nav className="space-y-2">
            {['Panel Principal', 'Mis Servicios', 'Pedidos', 'Agenda', 'Reseñas', 'Analíticas'].map((item, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  i === 0 ? 'bg-emerald-300/40 text-emerald-900 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <span>{/* Íconos SVG irían aquí */} ⏺</span>
                <span>{item}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 space-y-4">
          <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md">
            Mejorar Plan
          </button>
          <button className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-2">
            <span>🚪</span> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-[#F8F9FA] flex items-center justify-between px-8 z-10">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar servicios o clientes..." 
                className="w-full bg-white border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6 ml-4">
            <div className="flex space-x-4 text-gray-500 text-xl">
              <button className="relative hover:text-gray-800">
                🔔<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="hover:text-gray-800">❓</button>
              <button className="hover:text-gray-800">⚙️</button>
            </div>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <img src={avatar} alt={businessName} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
              <span className="text-sm font-bold text-gray-900">{businessName}</span>
            </div>
          </div>
        </header>

        {/* Inyección dinámica del contenido de la página */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}