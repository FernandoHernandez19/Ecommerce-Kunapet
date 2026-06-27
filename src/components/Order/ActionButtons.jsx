import React from 'react';

export default function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
      <button 
        onClick={() => window.location.href = '/tracking'}
        className="w-full sm:w-auto bg-[#006D44] hover:bg-[#005233] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all flex items-center justify-center"
      >
        <span>Seguir mi Pedido</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
      </button>
      <button 
        onClick={() => window.location.href = '/'}
        className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-8 rounded-full border border-gray-300 transition-all text-center"
      >
        Volver al Inicio
      </button>
    </div>
  );
}