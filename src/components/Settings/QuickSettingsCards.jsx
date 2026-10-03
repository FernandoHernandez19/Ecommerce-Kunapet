import React from 'react';

export default function QuickSettingsCards({ paymentMethod }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Tarjeta Perfil */}
      <button 
        onClick={() => window.location.href = '/settings/profile'}
        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-50 rounded-xl text-xl text-gray-600 group-hover:bg-red-50 group-hover:text-brand-primary transition-colors">
            👤
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">Ajustes de Perfil</h4>
            <p className="text-xs text-gray-400 font-medium">Dirección, notificaciones y seguridad</p>
          </div>
        </div>
        <span className="text-gray-400 group-hover:text-gray-600 transition-all">→</span>
      </button>

      {/* Tarjeta Pago */}
      <button 
        onClick={() => window.location.href = '/settings/billing'}
        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-50 rounded-xl text-xl text-gray-600 group-hover:bg-red-50 group-hover:text-brand-primary transition-colors">
            💳
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">Métodos de Pago</h4>
            <p className="text-xs text-gray-400 font-medium">
              {paymentMethod?.type} terminada en **** {paymentMethod?.lastFour}
            </p>
          </div>
        </div>
        <span className="text-gray-400 group-hover:text-gray-600 transition-all">→</span>
      </button>
    </div>
  );
}