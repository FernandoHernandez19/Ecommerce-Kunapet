import React from 'react';

export default function ModerationAlerts({ alerts }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Alertas de Moderación</h3>
        <button className="text-gray-400 hover:text-gray-900 font-bold tracking-widest pb-2">...</button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, idx) => {
          const isCritical = alert.severity === 'critical';
          const bg = isCritical ? 'bg-red-50/50' : 'bg-[#F4F3F1]';
          const border = isCritical ? 'border-red-100' : 'border-transparent';
          const icon = isCritical ? '🔴' : '⚠️';
          const actionColor = isCritical ? 'text-red-600 hover:text-red-800' : 'text-gray-600 hover:text-gray-900';

          return (
            <div key={idx} className={`${bg} border ${border} rounded-xl p-4 flex items-start space-x-3 transition-colors hover:shadow-sm`}>
              <div className="text-base mt-0.5">{icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900">{alert.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.description}</p>
                {alert.action && (
                  <button className={`mt-2 text-xs font-bold ${actionColor} transition-colors`}>
                    {alert.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}