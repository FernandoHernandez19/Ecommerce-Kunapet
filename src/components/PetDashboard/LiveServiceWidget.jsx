import React from 'react';

export default function LiveServiceWidget({ activeService, onOpenChat }) {
  if (!activeService) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm mb-6">
        <p className="text-sm font-medium text-gray-500">No hay servicios ejecutándose en este momento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E9F3EE] p-6 shadow-sm mb-6 sticky top-24">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] bg-emerald-100 text-[#006D44] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Servicio en Vivo
          </span>
          <h2 className="text-lg font-black text-gray-900 mt-1.5">{activeService.title}</h2>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
      </div>

      {/* Barra de progreso de estados */}
      <div className="my-6 relative pl-4 border-l-2 border-emerald-100 space-y-4">
        {activeService.steps.map((step, i) => (
          <div key={i} className="relative text-xs font-bold">
            <div className={`absolute -left-[21px] top-0.5 w-2 h-2 rounded-full border ${
              step.completed ? 'bg-[#006D44] border-[#006D44]' : 'bg-white border-gray-300'
            }`} />
            <span className={step.completed ? 'text-gray-950' : 'text-gray-400 font-medium'}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Datos del Prestador */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
        <div className="flex items-center space-x-3">
          <img src={activeService.provider.avatar} alt={activeService.provider.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-xs font-bold text-gray-900">{activeService.provider.name}</p>
            <p className="text-[10px] text-gray-500 font-medium">Paseador Asignado</p>
          </div>
        </div>
        <button 
          onClick={onOpenChat}
          className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold p-2 rounded-lg transition-colors"
          title="Abrir chat en tiempo real"
        >
          💬 Chat
        </button>
      </div>

      <button className="w-full py-3 bg-[#006D44] hover:bg-[#005233] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2">
        <span>🗺️</span> <span>Ver Mapa en Tiempo Real</span>
      </button>
    </div>
  );
}