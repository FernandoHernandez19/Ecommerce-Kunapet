import React from 'react';

export default function WizardLayout({ children, onBack, onClose }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col items-center py-6 px-4">
      {/* Cabecera del Wizard */}
      <header className="w-full max-w-3xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        </button>
        
        <div className="text-xl font-black text-[#006D44] tracking-tight">
          KunaPet
        </div>
        
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </header>

      {/* Contenedor del Formulario */}
      <main className="w-full max-w-3xl">
        {children}
      </main>
    </div>
  );
}