import React from 'react';

export default function SuccessCard({ onGoToDashboard, onViewProfile }) {
  return (
    <div className="bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center max-w-md w-full animate-fade-in-up">
      
      {/* Icono de Éxito Animado */}
      <div className="w-24 h-24 bg-[#6EE7B7] rounded-full flex items-center justify-center mb-8 shadow-sm">
        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      </div>

      {/* Textos */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
        ¡Registro Completado!
      </h1>
      <p className="text-gray-600 text-sm md:text-base mb-10 leading-relaxed font-medium">
        Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos en un plazo de <span className="font-bold text-gray-800">24-48 horas</span>.
      </p>

      {/* Botones de Acción */}
      <div className="w-full flex flex-col space-y-4">
        <button 
          onClick={onGoToDashboard}
          className="w-full bg-[#006D44] hover:bg-[#005233] text-white font-bold py-3.5 px-6 rounded-full shadow-md transition-colors"
        >
          Ir al Panel del Proveedor
        </button>
        <button 
          onClick={onViewProfile}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-6 rounded-full border border-gray-300 transition-colors"
        >
          Ver mi perfil público
        </button>
      </div>

    </div>
  );
}