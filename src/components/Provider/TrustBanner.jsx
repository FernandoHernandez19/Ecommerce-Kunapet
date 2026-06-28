import React from 'react';

export default function TrustBanner() {
  return (
    <div className="bg-[#E9F7EF] border border-[#CDEBDB] rounded-2xl p-5 flex items-start space-x-4 mt-8 mb-10">
      <div className="text-[#006D44] mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
      </div>
      <p className="text-sm text-[#004D30] font-medium leading-relaxed">
        Tu privacidad es nuestra prioridad. Todos los documentos subidos son encriptados y revisados manualmente por nuestro equipo de seguridad en un plazo máximo de 24 a 48 horas.
      </p>
    </div>
  );
}