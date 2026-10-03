import React from 'react';

export default function PetBioField({ bio, onBioChange }) {
  const MAX_LENGTH = 500;
  const currentLength = bio.length;
  
  // Lógica de colores preventivos
  const getCounterColor = () => {
    if (currentLength >= MAX_LENGTH) return 'text-red-500';
    if (currentLength >= 450) return 'text-amber-500';
    return 'text-gray-400';
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 flex items-center mb-2">
        <span className="text-[#e23d28] mr-2">📝</span> Breve Biografía
      </h3>
      <p className="text-sm text-gray-500 mb-6">Escribe un poco sobre la historia, gustos o manías de tu mascota.</p>
      
      <div className="relative">
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value.substring(0, MAX_LENGTH))}
          placeholder="Ej. A Max le encantan las pelotas de tenis, pero le asustan un poco los truenos..."
          className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl p-4 min-h-[160px] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e23d28]/20 focus:border-[#e23d28] resize-none transition-all pb-8"
        />
        <div className={`absolute bottom-3 right-4 text-xs font-bold ${getCounterColor()} transition-colors`}>
          {currentLength} / {MAX_LENGTH}
        </div>
      </div>
    </div>
  );
}