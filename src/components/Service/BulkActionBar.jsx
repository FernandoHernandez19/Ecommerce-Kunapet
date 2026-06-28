import React from 'react';

export default function BulkActionBar({ selectedCount, onUpdatePrices, onChangeAvailability, onDelete, onClose }) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="bg-[#EAEAEA] border border-gray-200/60 rounded-full px-6 py-4 flex items-center space-x-6 shadow-xl backdrop-blur-md">
        
        {/* Contador */}
        <div className="flex flex-col text-center pr-6 border-r border-gray-300">
          <span className="text-lg font-black text-gray-900 leading-none">{selectedCount}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Seleccionados</span>
        </div>

        {/* Acciones */}
        <button 
          onClick={onUpdatePrices}
          className="flex items-center space-x-2 text-[#006D44] hover:text-[#004D30] font-bold text-sm transition-colors"
        >
          <span>💵</span> <span>Actualizar Precios</span>
        </button>

        <button 
          onClick={onChangeAvailability}
          className="flex items-center space-x-2 text-[#006D44] hover:text-[#004D30] font-bold text-sm transition-colors"
        >
          <span>👁️</span> <span>Cambiar Disponibilidad</span>
        </button>

        <button 
          onClick={onDelete}
          className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-bold text-sm transition-colors pl-6 border-l border-gray-300"
        >
          <span>🗑️</span> <span>Eliminar</span>
        </button>

        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="ml-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-all"
          title="Cancelar selección en lote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}