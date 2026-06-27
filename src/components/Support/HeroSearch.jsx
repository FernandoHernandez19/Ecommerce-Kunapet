import React from 'react';

export default function HeroSearch() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#006D44] tracking-tight mb-4">
        ¿Cómo podemos ayudarte hoy?
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Encuentra respuestas rápidas a tus dudas sobre el cuidado de tu mascota, servicios y pedidos en KunaPet.
      </p>
      
      {/* Barra de Búsqueda Mejorada */}
      <div className="relative max-w-2xl mx-auto group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#006D44] transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input 
          type="text" 
          className="block w-full pl-11 pr-4 py-4 bg-[#F8F9FA] border-2 border-transparent rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#006D44] focus:ring-4 focus:ring-emerald-900/10 transition-all shadow-sm" 
          placeholder="Busca 'reembolso' o 'agendar cita'..." 
        />
      </div>
    </div>
  );
}