import React from 'react';

export default function BehaviorTags({ selectedTraits, onToggleTrait }) {
  const availableTraits = [
    { id: 'kids', label: 'Amigable con niños', icon: '👶' },
    { id: 'dogs', label: 'Sociable con otros perros', icon: '🐕' },
    { id: 'energy', label: 'Alta energía', icon: '⚡' },
    { id: 'calm', label: 'Tranquilo', icon: '🧘' },
    { id: 'vocal', label: 'Vocal / Ladrador', icon: '🔊' },
    { id: 'trained', label: 'Entrenado', icon: '🎓' },
    { id: 'special', label: 'Requiere cuidado especial', icon: '🩹' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6">
      <h3 className="text-lg font-bold text-gray-900 flex items-center mb-2">
        <span className="text-[#e23d28] mr-2">🏷️</span> Rasgos Principales
      </h3>
      <p className="text-sm text-gray-500 mb-6">Selecciona las etiquetas que mejor describan su forma de ser (Máx. 5).</p>
      
      <div className="flex flex-wrap gap-3">
        {availableTraits.map((trait) => {
          const isSelected = selectedTraits.includes(trait.id);
          const isDisabled = !isSelected && selectedTraits.length >= 5;

          return (
            <button
              key={trait.id}
              onClick={() => onToggleTrait(trait.id)}
              disabled={isDisabled}
              className={`flex items-center px-4 py-2 rounded-full border text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-[#e23d28]/30 ${
                isSelected 
                  ? 'bg-red-100 border-[#e23d28] text-[#e23d28]' 
                  : isDisabled
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2 grayscale opacity-80">{trait.icon}</span>
              {trait.label}
            </button>
          );
        })}
      </div>
      {selectedTraits.length >= 5 && (
        <p className="text-xs text-amber-600 font-bold mt-4 animate-fade-in">
          Has alcanzado el límite de 5 rasgos.
        </p>
      )}
    </div>
  );
}