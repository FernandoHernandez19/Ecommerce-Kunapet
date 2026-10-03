import React from 'react';

export default function ClaimHeader({ claimId, status, priority, openedAt, lastUpdated }) {
  return (
    <div className="mb-6">
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-4"
      >
        <span className="mr-2">←</span> Volver a la cola de reclamos
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reclamo {claimId}</h1>
          <span className="px-3 py-1 bg-[#F4F3ED] text-gray-700 text-xs font-bold rounded-full border border-gray-200 flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-600 mr-2"></span> {status}
          </span>
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center">
            <span className="mr-1">⚠</span> Prioridad {priority}
          </span>
        </div>
        
        <div className="text-right text-xs font-semibold text-gray-500">
          <p>Apertura: {openedAt}</p>
          <p>Última act: {lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}