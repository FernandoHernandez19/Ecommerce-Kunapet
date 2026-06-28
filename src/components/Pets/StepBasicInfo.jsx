import React from 'react';

export default function StepBasicInfo({ formData, updateData, onNext }) {
  const speciesOptions = [
    { id: 'perro', label: 'Perro', icon: '🐾' },
    { id: 'gato', label: 'Gato', icon: '🐱' },
    { id: 'otro', label: 'Otro', icon: '🦜' }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Información Básica</h2>
        <p className="text-sm text-gray-500 mt-2">Comencemos con los detalles esenciales de tu mascota. Esta información ayudará a conectar con los mejores servicios.</p>
      </div>

      <div className="space-y-6">
        {/* Subida de foto */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl mb-3">
            📷
          </div>
          <p className="text-sm font-bold text-gray-700">Subir una foto (opcional)</p>
          <p className="text-xs text-gray-400 mt-1">JPG o PNG, máx. 5MB</p>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Nombre de la Mascota <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="Ej. Max, Luna..." 
            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D44]/20 focus:border-[#006D44]" 
          />
        </div>

        {/* Especie */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Especie <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-4">
            {speciesOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateData('species', opt.id)}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                  formData.species === opt.id 
                    ? 'border-[#006D44] bg-emerald-50/50 text-[#006D44]' 
                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl mb-2 grayscale opacity-80">{opt.icon}</span>
                <span className="text-xs font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Raza y Fecha de Nacimiento */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Raza <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            <input 
              type="text" 
              value={formData.breed}
              onChange={(e) => updateData('breed', e.target.value)}
              placeholder="Buscar raza..." 
              className="w-full bg-gray-50 border border-gray-100 pl-10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D44]/20" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Fecha de Nacimiento (Aprox.)</label>
          <input 
            type="date" 
            value={formData.dob}
            onChange={(e) => updateData('dob', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:outline-none text-gray-600" 
          />
        </div>
      </div>

      {/* Footer del Step */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end items-center space-x-4">
        <button className="text-sm font-bold text-[#006D44] hover:text-[#005233]">Cancelar</button>
        <button 
          onClick={onNext}
          className="bg-[#006D44] hover:bg-[#005233] text-white text-sm font-bold py-3 px-6 rounded-full shadow-md transition-colors flex items-center"
        >
          Siguiente <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}