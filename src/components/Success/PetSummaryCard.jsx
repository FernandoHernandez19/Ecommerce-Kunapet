import React from 'react';

export default function PetSummaryCard({ pet }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md mx-auto mb-10 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex items-center space-x-5">
        
        {/* Avatar de la mascota */}
        <div className="w-20 h-20 rounded-full border-2 border-emerald-50 overflow-hidden shadow-sm flex-shrink-0">
          <img 
            src={pet.photoUrl} 
            alt={pet.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Detalles */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{pet.name}</h2>
          <p className="text-sm text-gray-600 font-medium mb-3">
            {pet.breed} <span className="mx-1">•</span> {pet.age}
          </p>
          
          {/* Etiquetas / Chips mejorados para contraste */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
              {pet.species}
            </span>
            <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
              {pet.status}
            </span>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
              {pet.vaccineStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}