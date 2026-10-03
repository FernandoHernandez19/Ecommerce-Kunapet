import React from 'react';
import ReactDOM from 'react-dom';
import { X, MapPin, Plus } from 'lucide-react';

export default function AddressSelectorModal({ 
  isOpen, 
  onClose, 
  addresses = [], 
  selectedAddressId, 
  onSelect, 
  onAddNew 
}) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Seleccionar Dirección
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Direcciones */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              onClick={() => {
                onSelect(addr);
                onClose();
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedAddressId === addr.id
                  ? 'border-brand-secondary bg-brand-secondary-light/10'
                  : 'border-gray-100 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-full ${selectedAddressId === addr.id ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-gray-100 text-gray-500'}`}>
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{addr.street}, {addr.district}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Añadir nueva */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={() => {
              onClose();
              onAddNew();
            }}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold text-brand-secondary hover:text-brand-secondary-hover py-3 px-4 bg-white border border-dashed border-brand-secondary/50 rounded-xl hover:bg-brand-secondary-light/10 transition-colors"
          >
            <Plus size={16} />
            Agregar nueva dirección
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
