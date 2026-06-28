import React from 'react';

export default function SuccessHero({ orderId, date }) {
  return (
    <div className="flex flex-col items-center text-center mb-12 animate-fade-in-down">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-[#e23d28]">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">¡Pedido Confirmado!</h1>
      <p className="text-gray-600 text-lg max-w-lg mb-6">
        Tu orden ha sido procesada exitosamente. Estamos preparando todo para tu peludo amigo.
      </p>
      
      <div className="flex items-center space-x-4">
        <span className="bg-gray-100 text-gray-800 font-bold px-4 py-2 rounded-full text-sm">
          Orden: #{orderId}
        </span>
        <span className="text-sm font-semibold text-gray-500">{date}</span>
        
        {/* Mejora UX 3: Botón de descarga */}
        <button className="flex items-center text-[#e23d28] hover:text-[#c93623] text-sm font-bold transition-colors ml-2" title="Descargar Recibo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          PDF
        </button>
      </div>
    </div>
  );
}