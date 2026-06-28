import React from 'react';

export default function StepHealthCare({ formData, updateData, onNext, onPrev }) {
  // Lógica de Mejora UX: Chips de alergias
  const handleAllergyChip = (tag) => {
    if (tag === 'Sin alergias') {
      updateData('allergies', 'Ninguna');
    } else {
      const current = formData.allergies === 'Ninguna' ? '' : formData.allergies;
      updateData('allergies', current ? `${current}, ${tag}` : tag);
    }
  };

  return (
    <div className="animate-fade-in-right">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#e23d28]">Salud y Cuidados</h2>
        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
          Ayúdanos a entender mejor las necesidades de tu mascota para conectarte con los mejores servicios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1: Datos Físicos */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 flex items-center mb-5">
            <span className="text-[#e23d28] mr-2">⚖️</span> Datos Físicos
          </h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-2">Peso Aproximado (kg)</label>
              <input 
                type="number" 
                value={formData.weight}
                onChange={(e) => updateData('weight', e.target.value)}
                placeholder="Ej: 12.5" 
                className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:border-[#e23d28]" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">¿Está esterilizado/a?</label>
              <div className="flex items-center space-x-2 h-10">
                {/* Custom Toggle Switch con Tailwind */}
                <button 
                  onClick={() => updateData('isSterilized', !formData.isSterilized)}
                  className={`w-11 h-6 rounded-full flex items-center transition-colors p-1 ${formData.isSterilized ? 'bg-[#e23d28]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isSterilized ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
                <span className="text-sm font-medium text-gray-700">{formData.isSterilized ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Vacunas Básicas */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 flex items-center mb-2">
            <span className="text-[#e23d28] mr-2">💉</span> Vacunas Básicas
          </h3>
          <p className="text-xs text-gray-500 mb-4">Selecciona las vacunas que están al día.</p>
          <div className="space-y-3">
            {['Antirrábica', 'Múltiple / Polivalente', 'Tos de las perreras (Bordetella)'].map(vax => {
              const isChecked = formData.vaccines.includes(vax);
              return (
                <label key={vax} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${isChecked ? 'border-[#e23d28] bg-red-50/30' : 'border-gray-200 hover:border-emerald-300'}`}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={(e) => {
                      const newVax = e.target.checked 
                        ? [...formData.vaccines, vax]
                        : formData.vaccines.filter(v => v !== vax);
                      updateData('vaccines', newVax);
                    }}
                    className="w-4 h-4 text-[#e23d28] rounded border-gray-300 focus:ring-[#e23d28] mr-3"
                  />
                  <span className="text-sm font-medium text-gray-800">{vax}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Card 3: Alergias */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
          <h3 className="text-base font-bold text-gray-900 flex items-center mb-4">
            <span className="text-[#e23d28] mr-2">🤧</span> Alergias
          </h3>
          <label className="block text-xs font-bold text-gray-700 mb-2">Alergias conocidas (Opcional)</label>
          <textarea 
            rows="2"
            value={formData.allergies}
            onChange={(e) => updateData('allergies', e.target.value)}
            placeholder="Ej: Alergia al pollo, picaduras de pulga..."
            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e23d28]/20 resize-none mb-3"
          ></textarea>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleAllergyChip('Sin alergias')} className="px-3 py-1 bg-red-100 text-emerald-800 text-xs font-bold rounded-full hover:bg-emerald-200">Sin alergias</button>
            <button onClick={() => handleAllergyChip('Alimento')} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-200">+ Alimento</button>
            <button onClick={() => handleAllergyChip('Ambiental')} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-200">+ Ambiental</button>
          </div>
        </div>

        {/* Card 4: Necesidades Especiales */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
          <h3 className="text-base font-bold text-gray-900 flex items-center mb-4">
            <span className="text-[#e23d28] mr-2">♡</span> Necesidades Especiales
          </h3>
          <label className="block text-xs font-bold text-gray-700 mb-2">Notas adicionales para cuidadores (Opcional)</label>
          <textarea 
            rows="3"
            value={formData.specialNeeds}
            onChange={(e) => updateData('specialNeeds', e.target.value)}
            placeholder="Ej: Necesita tomar medicación a las 8pm, le dan miedo los truenos, problemas de movilidad..."
            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e23d28]/20 resize-none mb-3"
          ></textarea>
          <p className="text-[10px] text-gray-500 font-medium flex items-start">
            <span className="mr-1 mt-0.5">ⓘ</span> Esta información es vital para garantizar el bienestar de tu mascota con los proveedores de servicios.
          </p>
        </div>

      </div>

      {/* Navegación Inferior */}
      <div className="flex justify-between items-center w-full mt-4">
        <button 
          onClick={onPrev}
          className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-bold hover:bg-white transition-colors"
        >
          Atrás
        </button>
        <button 
          onClick={onNext}
          className="bg-[#e23d28] hover:bg-[#c93623] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-md transition-colors flex items-center"
        >
          Siguiente <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}