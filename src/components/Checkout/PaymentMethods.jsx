import React, { useRef } from 'react';
import { CreditCard, Smartphone, Building2, Lock, QrCode, Upload, Copy } from 'lucide-react';

export default function PaymentMethods({ selectedMethod, onSelectMethod }) {
  const fileInputRef = useRef(null);

  const methods = [
    { id: 'card', label: 'Tarjeta de Crédito / Débito', icon: <CreditCard size={20} className="text-gray-400" /> },
    { id: 'yape', label: 'Yape / Plin', icon: <Smartphone size={20} className="text-gray-400" /> },
    { id: 'transfer', label: 'Transferencia Bancaria', icon: <Building2 size={20} className="text-gray-400" /> }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Método de Pago
      </h2>

      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div 
              key={method.id} 
              className={`border rounded-xl transition-all overflow-hidden ${isSelected ? 'border-brand-secondary bg-brand-secondary-light/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <label className="flex items-center justify-between p-4 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-brand-secondary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-fade-in"></div>}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {method.label}
                  </span>
                </div>
                {method.icon}
                <input 
                  type="radio" 
                  name="payment" 
                  className="sr-only" 
                  checked={isSelected}
                  onChange={() => onSelectMethod(method.id)} 
                />
              </label>

              {/* Contenido Acordeón: Tarjeta */}
              {isSelected && method.id === 'card' && (
                <div className="p-4 pt-0 border-t border-brand-secondary/20 animate-fade-in-down">
                  <div className="space-y-4 mt-4">
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Número de Tarjeta" className="w-full text-sm pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-white" />
                    </div>
                    <div className="flex gap-4">
                      <input type="text" placeholder="MM/AA" className="w-1/2 text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-white" />
                      <div className="w-1/2 relative">
                        <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="CVV" className="w-full text-sm p-3 pr-10 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido Acordeón: Yape/Plin */}
              {isSelected && method.id === 'yape' && (
                <div className="p-5 pt-2 border-t border-brand-secondary/20 animate-fade-in-down flex flex-col items-center">
                  <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-200 rounded-2xl mb-4 flex items-center justify-center">
                    <QrCode size={48} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-900 font-bold mb-1">Escanea el QR o envía a:</p>
                  <p className="text-lg text-brand-secondary font-black tracking-wider mb-4">999 999 999</p>
                  
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-brand-secondary hover:text-brand-secondary rounded-xl text-sm font-bold text-gray-700 transition-all shadow-sm"
                  >
                    <Upload size={16} />
                    Adjuntar comprobante
                  </button>
                </div>
              )}

              {/* Contenido Acordeón: Transferencia */}
              {isSelected && method.id === 'transfer' && (
                <div className="p-4 pt-2 border-t border-brand-secondary/20 animate-fade-in-down">
                  <p className="text-xs text-gray-500 mb-4 font-medium">Transfiere el monto exacto a una de nuestras cuentas y guarda tu comprobante.</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-0.5">BCP Soles</p>
                        <p className="text-sm font-mono font-medium text-gray-900">191-12345678-0-99</p>
                      </div>
                      <button onClick={() => handleCopy('191-12345678-0-99')} className="p-2 text-brand-secondary hover:bg-brand-secondary-light/30 rounded-lg transition-colors" title="Copiar">
                        <Copy size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-0.5">Interbank Soles</p>
                        <p className="text-sm font-mono font-medium text-gray-900">200-3004005006</p>
                      </div>
                      <button onClick={() => handleCopy('200-3004005006')} className="p-2 text-brand-secondary hover:bg-brand-secondary-light/30 rounded-lg transition-colors" title="Copiar">
                        <Copy size={16} />
                      </button>
                    </div>
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