import React from 'react';

export default function ZoneSelector({ selectedZones, onToggleZone }) {
  // Lista de zonas populares basadas en el contexto peruano
  const popularZones = ['San Isidro', 'Barranco', 'Surco', 'Miraflores', 'La Molina'];

  return (
    <div className="mb-6 relative z-10">
      <label className="block text-xs font-bold text-gray-700 mb-1">
        Zonas de Atención Principal <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 mb-3">Selecciona los distritos donde ofreces tus servicios.</p>
      
      <div className="flex flex-wrap gap-2">
        {/* Mostramos las zonas seleccionadas y las populares sugeridas */}
        {[...new Set([...selectedZones, ...popularZones.slice(0, 4)])].map((zone) => {
          const isSelected = selectedZones.includes(zone);
          return (
            <button
              key={zone}
              onClick={(e) => { e.preventDefault(); onToggleZone(zone); }}
              className={`flex items-center px-4 py-2 rounded-full border text-sm font-bold transition-colors ${
                isSelected 
                  ? 'bg-emerald-300/40 border-emerald-300 text-emerald-900' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {zone} {isSelected && <span className="ml-2 text-emerald-700">×</span>}
            </button>
          );
        })}
        
        {/* Botón para abrir modal/dropdown de más zonas */}
        <button 
          onClick={(e) => e.preventDefault()}
          className="flex items-center px-4 py-2 rounded-full border border-dashed border-gray-400 text-gray-600 hover:text-[#006D44] hover:border-[#006D44] text-sm font-bold transition-colors"
        >
          + Añadir otro
        </button>
      </div>
    </div>
  );
}