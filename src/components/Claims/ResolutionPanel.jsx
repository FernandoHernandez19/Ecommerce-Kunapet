import React, { useState } from 'react';

export default function ResolutionPanel() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [notes, setNotes] = useState('');

  // Lógica de Validación: Debe haber una opción y notas largas
  const isFormValid = selectedOption !== null && notes.trim().length >= 10;

  const options = [
    { id: 'partial', title: 'Reembolso Parcial (50%)', desc: 'Devolver fondos parciales al cliente; pago reducido al proveedor.' },
    { id: 'full', title: 'Reembolso Total al Cliente', desc: 'Servicio no cumplido. Penalización al proveedor.' },
    { id: 'dismiss', title: 'Desestimar Reclamo', desc: 'Evidencia insuficiente. Pago normal al proveedor.' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Resolución Emitida:", { option: selectedOption, notes });
    // Aquí iría la llamada a tu API backend
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-[#E9F3EE] p-6 shadow-sm sticky top-6">
      <div className="flex items-start space-x-3 mb-4">
        <span className="text-emerald-700 text-xl mt-1">⚖️</span>
        <div>
          <h2 className="text-lg font-bold text-[#006D44]">Acción de Resolución</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Determine el resultado final de este reclamo basándose en la evidencia.</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {options.map((opt) => (
          <label 
            key={opt.id} 
            className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${
              selectedOption === opt.id 
                ? 'border-emerald-600 bg-emerald-50/50' 
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center h-5 mr-3">
              <input 
                type="radio" 
                name="resolution" 
                value={opt.id}
                onChange={() => setSelectedOption(opt.id)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" 
              />
            </div>
            <div>
              <p className={`text-sm font-bold ${selectedOption === opt.id ? 'text-emerald-900' : 'text-gray-900'}`}>
                {opt.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-700 mb-2">Notas de Resolución Oficiales</label>
        <textarea 
          rows="4" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escriba la justificación final aquí. Esto será visible para ambas partes."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none resize-none transition-all"
        ></textarea>
        {notes.length > 0 && notes.length < 10 && (
          <p className="text-[10px] text-red-500 mt-1">Mínimo 10 caracteres requeridos.</p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={!isFormValid}
        className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
          isFormValid 
            ? 'bg-[#006D44] hover:bg-[#005233] text-white shadow-md' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span>✓</span> <span>Emitir Resolución</span>
      </button>
    </form>
  );
}