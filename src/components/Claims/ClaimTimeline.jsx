import React from 'react';

export default function ClaimTimeline({ events }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-emerald-700 text-xl">⏱</span>
        <h2 className="text-lg font-bold text-gray-900">Evidencia y Línea de Tiempo</h2>
      </div>

      <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 pb-4">
        {events.map((evt, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-[10px]">
              {evt.icon}
            </div>
            
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-gray-900">{evt.title}</h4>
              <span className="text-[11px] font-bold text-gray-500">{evt.timestamp}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{evt.description}</p>
            
            {/* Si hay evidencia visual, la renderizamos con mejora UX */}
            {evt.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 max-w-sm">
                <img 
                  src={evt.image} 
                  alt="Evidencia del reclamo" 
                  className="w-full h-auto cursor-zoom-in hover:opacity-90 transition-opacity"
                  title="Haz clic para ampliar"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}