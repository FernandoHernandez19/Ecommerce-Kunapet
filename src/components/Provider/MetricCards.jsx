import React from 'react';

export default function MetricCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { title: 'Ventas del mes', value: metrics.sales, icon: '💵', bg: 'bg-emerald-50', color: 'text-emerald-600' },
        { title: 'Servicios activos', value: metrics.activeServices, icon: '🐾', bg: 'bg-emerald-500', color: 'text-white' },
        { title: 'Calificación', value: `${metrics.rating} (${metrics.reviews})`, icon: '⭐', bg: 'bg-amber-400', color: 'text-amber-900' },
        { title: 'Mensajes', value: metrics.messages, icon: '✉️', bg: 'bg-red-50', color: 'text-red-500' }
      ].map((card, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${card.bg} ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">{card.title}</p>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}