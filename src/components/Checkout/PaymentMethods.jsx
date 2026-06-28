import React from 'react';

export default function PaymentMethods({ selectedMethod, onSelectMethod }) {
  const methods = [
    { id: 'card', label: 'Tarjeta de Crédito / Débito', icon: '💳' },
    { id: 'yape', label: 'Yape / Plin', icon: '📱' },
    { id: 'transfer', label: 'Transferencia Bancaria', icon: '🏦' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center mb-5">
        <span className="text-[#e23d28] mr-2">💵</span> Método de Pago
      </h2>

      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div key={method.id} className={`border rounded-xl transition-all overflow-hidden ${isSelected ? 'border-[#e23d28] bg-red-50/10' : 'border-gray-200'}`}>
              
              {/* Cabecera del Radio Button */}
              <label className="flex items-center justify-between p-4 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#e23d28]' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#e23d28]"></div>}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {method.label}
                  </span>
                </div>
                <span className="text-gray-400 text-lg">{method.icon}</span>
                {/* Input real oculto visualmente por accesibilidad */}
                <input 
                  type="radio" 
                  name="payment" 
                  className="sr-only" 
                  checked={isSelected}
                  onChange={() => onSelectMethod(method.id)} 
                />
              </label>

              {/* Mejora UX: Formulario Desplegable Condicional */}
              {isSelected && method.id === 'card' && (
                <div className="p-4 pt-0 border-t border-gray-100 animate-fade-in-down">
                  <div className="space-y-3 mt-4">
                    <input type="text" placeholder="Número de Tarjeta" className="w-full text-sm p-3 border border-gray-200 rounded-lg outline-none focus:border-[#e23d28] focus:ring-1 focus:ring-[#e23d28] transition-all" />
                    <div className="flex space-x-3">
                      <input type="text" placeholder="MM/AA" className="w-1/2 text-sm p-3 border border-gray-200 rounded-lg outline-none focus:border-[#e23d28] transition-all" />
                      <input type="text" placeholder="CVV" className="w-1/2 text-sm p-3 border border-gray-200 rounded-lg outline-none focus:border-[#e23d28] transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {isSelected && method.id === 'yape' && (
                <div className="p-4 pt-0 border-t border-gray-100 text-center animate-fade-in-down">
                  <p className="text-xs text-gray-500 mt-4 mb-2">Escanea el código QR desde tu app para pagar de forma rápida y segura.</p>
                  <div className="w-32 h-32 bg-gray-100 border border-gray-200 rounded-xl mx-auto flex items-center justify-center text-gray-400">
                    [QR Code]
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}