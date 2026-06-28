import React from 'react';

export default function ServiceCard({ service, onToggleActive, onDelete, isBatchMode, isSelected, onToggleSelection }) {
  
  // Estilos condicionales si la tarjeta está seleccionada
  const cardClasses = `bg-white rounded-3xl border p-6 transition-all flex flex-col h-full relative cursor-pointer ${
    isSelected 
      ? 'border-[#006D44] ring-2 ring-[#006D44]/20 shadow-md' 
      : 'border-gray-100 shadow-sm hover:shadow-md'
  }`;

  return (
    <div 
      className={cardClasses}
      onClick={() => { if (isBatchMode) onToggleSelection(service.id); }}
    >
      {/* Checkbox Absoluto para el Modo Lote (Mejora UX 1) */}
      {isBatchMode && (
        <div className="absolute -top-3 -left-3 z-10 bg-white rounded-full p-1 shadow-sm">
          <input 
            type="checkbox" 
            checked={isSelected}
            readOnly
            className="w-6 h-6 text-[#006D44] bg-gray-100 border-gray-300 rounded focus:ring-[#006D44] cursor-pointer"
          />
        </div>
      )}

      {/* Cabecera de la Tarjeta */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${service.iconBg}`}>
          {service.icon}
        </div>
        
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-xs font-bold text-gray-500">Activo</span>
          <button 
            onClick={() => onToggleActive(service.id)}
            disabled={isBatchMode} // Deshabilitamos toggle individual en modo lote
            className={`w-12 h-6 rounded-full flex items-center transition-colors p-1 relative ${service.isActive ? 'bg-[#5EEAD4]' : 'bg-gray-200'} ${isBatchMode && 'opacity-50 cursor-not-allowed'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${service.isActive ? 'translate-x-5' : 'translate-x-0'}`}>
              {service.isActive && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">{service.title}</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{service.description}</p>
      </div>

      <div className="bg-[#F8F9FA] rounded-2xl p-4 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Precio base</p>
          <p className="text-xl font-black text-[#006D44]">{service.price}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Duración est.</p>
          <p className="text-sm font-bold text-gray-900 flex items-center justify-end">
            <span className="mr-1">🕒</span> {service.duration}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
        <button disabled={isBatchMode} className="flex-1 border border-[#006D44] text-[#006D44] hover:bg-emerald-50 font-bold py-2.5 rounded-full text-sm transition-colors disabled:opacity-50">
          Editar
        </button>
        <button 
          onClick={() => onDelete(service.id)}
          disabled={isBatchMode}
          className="w-11 h-11 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}