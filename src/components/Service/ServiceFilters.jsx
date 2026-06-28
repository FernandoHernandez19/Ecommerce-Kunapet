import React from 'react';

export default function ServiceFilters({ activeCategory, setActiveCategory }) {
  const categories = ['Todos', 'Paseos', 'Grooming', 'Alojamiento'];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Píldoras de Categoría */}
      <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-emerald-300/40 text-[#e23d28]'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selector de Orden */}
      <div className="flex items-center space-x-3 text-sm">
        <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Ordenar por:</span>
        <div className="relative">
          <select className="bg-transparent text-gray-900 font-bold pr-6 outline-none cursor-pointer appearance-none">
            <option>Más recientes</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}