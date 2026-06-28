import React from 'react';

export default function AddServiceCard() {
  return (
    <button className="bg-transparent border-2 border-dashed border-gray-300 hover:border-[#e23d28] hover:bg-red-50/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all h-full min-h-[350px] group outline-none focus:ring-4 focus:ring-[#e23d28]/20">
      <div className="w-14 h-14 bg-gray-200 group-hover:bg-[#e23d28] text-gray-500 group-hover:text-white rounded-full flex items-center justify-center text-2xl mb-6 transition-colors shadow-sm">
        +
      </div>
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#e23d28] mb-3 transition-colors">
        Añadir Servicio Rápido
      </h3>
      <p className="text-sm text-gray-500 font-medium px-4">
        Crea un nuevo servicio en segundos desde una plantilla.
      </p>
    </button>
  );
}