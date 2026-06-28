import React from 'react';

export default function DeliveryCard({ address, estimatedTime }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 relative overflow-hidden">
      {/* Marca de agua decorativa */}
      <div className="absolute -right-6 -top-2 opacity-[0.03] pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 0 6 0h3a3 3 0 1 0 6 0h.75a1.875 1.875 0 0 0 1.875-1.875V10.5l-2.671-3.667A3.003 3.003 0 0 0 15.901 5.5H15v9.5ZM16.5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>
      </div>

      <h2 className="text-lg font-bold text-gray-900 flex items-center mb-4 relative z-10">
        <span className="text-[#e23d28] mr-2">🚚</span> Detalles de Entrega
      </h2>

      <div className="flex items-start space-x-3 mb-6 relative z-10">
        <span className="text-gray-400 mt-0.5">📍</span>
        <div>
          <p className="text-sm font-bold text-gray-900">{address.title}</p>
          <p className="text-xs text-gray-600 mt-1">{address.line1}</p>
          <p className="text-xs text-gray-600">{address.line2}</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center space-x-3 relative z-10">
        <span className="text-brand-primary">⏱</span>
        <div>
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Entrega Estimada</p>
          <p className="text-sm font-bold text-gray-900">{estimatedTime}</p>
        </div>
      </div>
    </div>
  );
}