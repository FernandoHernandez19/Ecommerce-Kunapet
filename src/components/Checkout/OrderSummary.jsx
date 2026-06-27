import React from 'react';

export default function OrderSummary({ items, totals, onPay, isReadyToPay }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">
        Resumen de compra
      </h2>

      {/* Lista de Ítems */}
      <div className="space-y-6 mb-6 border-b border-gray-100 pb-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex space-x-4">
            <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 font-medium mb-1">{item.subtitle}</p>
              <p className="text-sm font-bold text-gray-900">{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotales */}
      <div className="space-y-3 text-sm mb-6 border-b border-gray-100 pb-6">
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Subtotal</span>
          <span>{totals.subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Costo de envío</span>
          <span>{totals.shipping}</span>
        </div>
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Tarifa de servicio</span>
          <span>{totals.serviceFee}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-end mb-8">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-3xl font-black text-[#006D44]">{totals.total}</span>
      </div>

      {/* Botón de Pago (Mejora UX 3: Bloqueo condicional) */}
      <button 
        onClick={onPay}
        disabled={!isReadyToPay}
        className={`w-full py-4 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center space-x-2 ${
          isReadyToPay 
            ? 'bg-[#006D44] hover:bg-[#005233] text-white' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>🔒</span>
        <span>Pagar {totals.total}</span>
      </button>

      <p className="text-center text-[10px] text-gray-500 font-bold mt-4 uppercase tracking-wider flex items-center justify-center">
        <span className="mr-1">🛡️</span> Pago 100% seguro y encriptado
      </p>
    </div>
  );
}