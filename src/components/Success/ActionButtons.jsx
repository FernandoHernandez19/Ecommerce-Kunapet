import React from 'react';

export default function ActionButtons({ onGoToDashboard, onAddAnother }) {
  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
      <button 
        onClick={onGoToDashboard}
        className="w-full bg-[#e23d28] hover:bg-[#c93623] text-white font-bold py-3.5 px-6 rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <span>Ir a Mi Panel</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
      </button>

      <button 
        onClick={onAddAnother}
        className="w-full bg-white hover:bg-red-50 text-[#e23d28] font-bold py-3.5 px-6 rounded-full border-2 border-[#e23d28] transition-all flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        <span>Añadir Otra Mascota</span>
      </button>
    </div>
  );
}