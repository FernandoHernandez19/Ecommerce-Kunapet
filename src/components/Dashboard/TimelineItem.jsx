import React from 'react';

export default function TimelineItem({ activity }) {
  // Lógica de estilos aislada dentro de su propio componente
  const getStatusStyles = (status) => {
    switch (status) {
      case 'EN CURSO': return 'bg-red-100 text-emerald-800 border-emerald-200';
      case 'COMPLETADO': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'ENTREGADO': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const isEnCurso = activity.status === 'EN CURSO';

  return (
    <div className="relative group">
      {/* Indicador de estado (Punto en la línea) */}
      <span className={`absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-4 transition-all ${
        isEnCurso 
          ? 'bg-brand-primary ring-red-100 animate-pulse' 
          : 'bg-gray-300 ring-transparent group-hover:bg-emerald-400'
      }`} />

      {/* Contenido del evento */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {activity.time}
          </span>
          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${getStatusStyles(activity.status)}`}>
            {activity.status}
          </span>
        </div>
        <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#c93623] transition-colors">
          {activity.title}
        </h4>
        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
          {isEnCurso ? '📍' : '🐾'} {activity.details}
        </p>
      </div>
    </div>
  );
}