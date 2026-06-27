import React from 'react';

export default function BusinessWidgets({ stockAlerts, growth }) {
  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Alertas de Stock */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-red-500 mr-2">⚠️</span> Alertas de Stock
        </h3>
        <div className="space-y-3 mb-5">
          {stockAlerts.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-medium">
              <span className="text-gray-700">{item.name}</span>
              <span className={`px-2 py-1 rounded font-bold ${
                item.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {item.quantity} UNIDADES
              </span>
            </div>
          ))}
        </div>
        <button className="w-full py-2 border border-emerald-600 text-emerald-700 font-bold text-xs rounded-lg hover:bg-emerald-50">
          Gestionar Inventario
        </button>
      </div>

      {/* Crecimiento Semanal */}
      <div className="bg-emerald-800 rounded-2xl p-5 text-white flex-1 relative overflow-hidden shadow-lg">
        <h3 className="text-xs font-semibold text-emerald-100 mb-1">Crecimiento Semanal</h3>
        <p className="text-3xl font-black mb-6">+{growth}%</p>
        
        {/* Simulación del gráfico de barras */}
        <div className="flex items-end space-x-1.5 h-12 mb-2">
          {[40, 50, 45, 60, 55, 80, 100].map((height, i) => (
             <div key={i} className={`w-full rounded-t-sm ${i === 6 ? 'bg-white' : 'bg-emerald-500/50'}`} style={{ height: `${height}%` }}></div>
          ))}
        </div>
        <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider">Rendimiento vs semana pasada</p>
      </div>
    </div>
  );
}