import React from 'react';

const getStatusStyles = (status) => {
  switch (status) {
    case 'EN CURSO':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'COMPLETADO':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'ENTREGADO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function ActivityTimeline({ activities }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="text-lg font-bold text-gray-900 tracking-tight">Actividad</h3>
      
      <div className="relative pl-4 border-l-2 border-gray-100 space-y-6 ml-2 py-2">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Nodo de la línea de tiempo */}
            <span className={`absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-4 ${
              act.status === 'EN CURSO' ? 'bg-emerald-600 ring-emerald-100 animate-pulse' : 'bg-gray-300 ring-transparent'
            }`} />

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {act.time}
                </span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${getStatusStyles(act.status)}`}>
                  {act.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-800 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                {act.status === 'EN CURSO' ? '📍' : '🐾'} {act.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors pt-2 border-t border-gray-50 block">
        Ver historial completo
      </button>
    </div>
  );
}