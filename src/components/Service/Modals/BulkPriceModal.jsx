import React, { useState } from 'react';

export default function BulkPriceModal({ isOpen, onClose, selectedCount, onConfirm }) {
  const [updateType, setUpdateType] = useState('percentage'); // 'percentage' | 'fixed'
  const [action, setAction] = useState('increase'); // 'increase' | 'decrease'
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || isNaN(value)) return;
    onConfirm({ type: updateType, action, amount: parseFloat(value) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center">
            <span className="text-[#006D44] mr-2">💵</span> Actualizar Precios
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6 font-medium">
          Estás a punto de modificar el precio de <span className="font-bold text-gray-900">{selectedCount} servicios seleccionados</span>.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Opciones de tipo de actualización */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setUpdateType('percentage')}
              className={`py-2 px-4 rounded-xl text-sm font-bold border transition-colors ${updateType === 'percentage' ? 'border-[#006D44] bg-emerald-50 text-[#006D44]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Porcentaje (%)
            </button>
            <button
              type="button"
              onClick={() => setUpdateType('fixed')}
              className={`py-2 px-4 rounded-xl text-sm font-bold border transition-colors ${updateType === 'fixed' ? 'border-[#006D44] bg-emerald-50 text-[#006D44]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Monto Fijo (S/)
            </button>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="w-1/3">
              <select 
                value={action} 
                onChange={(e) => setAction(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#006D44]/20"
              >
                <option value="increase">Aumentar</option>
                <option value="decrease">Reducir</option>
              </select>
            </div>
            <div className="w-2/3 relative">
              <input 
                type="number" 
                min="0"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={updateType === 'percentage' ? 'Ej: 10' : 'Ej: 5.00'}
                className="w-full bg-white border border-gray-200 p-3.5 pl-10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#006D44]/20 focus:border-[#006D44]"
                required
              />
              <span className="absolute left-4 top-3.5 text-gray-400 font-bold">
                {updateType === 'percentage' ? '%' : 'S/'}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="w-1/2 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="w-1/2 py-3.5 rounded-xl font-bold text-white bg-[#006D44] hover:bg-[#005233] shadow-md transition-colors">
              Aplicar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}