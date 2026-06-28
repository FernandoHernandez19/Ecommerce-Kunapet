import React from 'react';

export default function ActiveCases({ ticket }) {
  return (
    <div className="w-full lg:w-80 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
        <h2 className="text-lg font-bold text-gray-900">Tus Casos Activos</h2>
      </div>

      <div className="bg-[#FDFDFD] border border-gray-200 rounded-xl p-4 mb-4 hover:border-emerald-300 transition-colors cursor-pointer">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-gray-900">{ticket.id}</span>
          <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{ticket.status}</span>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-2 leading-tight">{ticket.subject}</p>
        <p className="text-[11px] text-gray-500 font-medium">Actualizado hace {ticket.updatedAgo}</p>
      </div>

      <div className="mt-auto pt-6 flex justify-center border-t border-gray-50">
        <a href="/mis-tickets" className="text-xs font-bold text-[#e23d28] hover:text-[#c93623] transition-colors">
          Ver historial completo
        </a>
      </div>
    </div>
  );
}