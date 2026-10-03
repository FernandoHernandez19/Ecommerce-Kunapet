import React from 'react';

export default function BulkStatusModal({ isOpen, onClose, selectedCount, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up text-center">
        
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Cambiar Disponibilidad</h2>
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Selecciona el nuevo estado para los <span className="font-bold text-gray-900">{selectedCount} servicios</span>. Los servicios inactivos no aparecerán en las búsquedas de los clientes.
        </p>

        <div className="flex flex-col space-y-3 mb-6">
          <button 
            onClick={() => onConfirm(true)}
            className="w-full py-3.5 rounded-xl font-bold text-[#e23d28] bg-red-50 border border-[#e23d28] hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <span className="w-2 h-2 rounded-full bg-[#e23d28] mr-2"></span> Marcar como Activos
          </button>
          <button 
            onClick={() => onConfirm(false)}
            className="w-full py-3.5 rounded-xl font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span> Marcar como Inactivos
          </button>
        </div>

        <button onClick={onClose} className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}