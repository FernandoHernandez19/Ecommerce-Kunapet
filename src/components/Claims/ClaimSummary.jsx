import React from 'react';

export default function ClaimSummary({ client, provider, motive, motiveDescription }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#E9F3EE] p-6 shadow-sm mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-brand-primary text-xl">🧾</span>
        <h2 className="text-lg font-bold text-gray-900">Resumen de la Disputa</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cliente</p>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              👤
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{client.name}</p>
              <p className="text-xs text-gray-500 font-medium">UID: {client.uid}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Proveedor (Paseador)</p>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              🐾
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{provider.name}</p>
              <p className="text-xs text-gray-500 font-medium">PID: {provider.pid}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Motivo Principal</p>
        <div className="border-l-4 border-red-600 bg-red-50/30 p-4 rounded-r-xl">
          <h3 className="text-base font-bold text-gray-900 mb-1">{motive}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{motiveDescription}</p>
        </div>
      </div>
    </div>
  );
}