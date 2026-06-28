import React from 'react';

export default function FilterPanel() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full lg:w-72 flex-shrink-0">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <span className="mr-2">≡</span> Filtros
        </h3>
        <button className="text-xs font-bold text-[#e23d28] hover:text-[#c93623] transition-colors">
          Limpiar
        </button>
      </div>

      <div className="space-y-8">
        {/* Sección Estado */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Estado</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#e23d28] rounded focus:ring-[#e23d28] border-gray-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Nuevo</span>
              </div>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">12</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#e23d28] rounded focus:ring-[#e23d28] border-gray-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">En Investigación</span>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">8</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900">Resuelto</span>
              </div>
            </label>
          </div>
        </div>

        {/* Sección Prioridad */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Prioridad</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Alta</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Media</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Baja</span>
            </label>
          </div>
        </div>

        {/* Sección Categoría */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Categoría</h4>
          <div className="flex flex-wrap gap-2">
            <button className="bg-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-brand-primary transition-colors">Servicio</button>
            <button className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-300 transition-colors">Producto</button>
            <button className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-300 transition-colors">Facturación</button>
          </div>
        </div>
      </div>
    </div>
  );
}