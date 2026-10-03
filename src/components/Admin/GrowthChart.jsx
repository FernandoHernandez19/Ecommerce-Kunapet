import React from 'react';

export default function GrowthChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Reportes Recientes</h3>
        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-100">
          <option>Últimos 30 días</option>
          <option>Este mes</option>
          <option>Este año</option>
        </select>
      </div>
      
      {/* Contenedor del Gráfico (Mockup UI) */}
      <div className="flex-1 bg-[#F5F7F6] rounded-xl flex flex-col items-center justify-center p-6 min-h-[300px]">
        <div className="flex items-end space-x-2 h-16 mb-4">
          <div className="w-3 h-8 bg-emerald-300 rounded-sm"></div>
          <div className="w-3 h-12 bg-emerald-400 rounded-sm"></div>
          <div className="w-3 h-16 bg-brand-primary rounded-sm"></div>
        </div>
        <p className="text-sm font-semibold text-gray-500">Visualización de Crecimiento</p>
        <p className="text-xs text-gray-400 mt-1">Conecta Recharts o Chart.js aquí</p>
      </div>
    </div>
  );
}