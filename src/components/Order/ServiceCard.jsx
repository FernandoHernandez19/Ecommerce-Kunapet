import React from 'react';

export default function ServiceCard({ provider, schedule }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <span className="text-[#e23d28] mr-2">✣</span> Detalles del Servicio
        </h2>
        {/* Mejora UX 2: Añadir al calendario */}
        <button className="text-xs font-bold text-[#e23d28] hover:text-[#c93623] bg-red-50 px-3 py-1 rounded-full transition-colors flex items-center">
          📅 Añadir a Calendario
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-50">
        <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
        <div>
          <p className="text-sm font-bold text-gray-900">{provider.name}</p>
          <p className="text-xs text-amber-500 font-bold flex items-center mt-0.5">
            ⭐ {provider.rating} <span className="text-gray-400 font-medium ml-1">({provider.reviews} paseos)</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center">📅 Fecha</p>
          <p className="text-sm font-bold text-gray-900">{schedule.date}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center">🕒 Hora</p>
          <p className="text-sm font-bold text-gray-900">{schedule.time}</p>
        </div>
      </div>
    </div>
  );
}