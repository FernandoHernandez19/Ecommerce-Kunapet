import React from 'react';
import ImageUploader from './ImageUploader';
import ZoneSelector from './ZoneSelector';

export default function StepBusinessProfile({ formData, updateData, onNext }) {
  const MAX_DESC = 300;
  const currentLength = formData.description.length;

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
      {/* Marca de agua (Huella) */}
      <div className="absolute -right-8 -top-8 text-gray-50 opacity-60 pointer-events-none select-none z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48"><path d="M11.999 4c-1.528 0-2.813 1.053-3.155 2.505-.187.795-.916 1.353-1.72 1.393-1.637.08-2.95 1.393-3.03 3.03-.04.804-.598 1.533-1.393 1.72C1.249 13.01 2.222 14.5 3.75 14.5c.328 0 .644-.06.94-.17a2.531 2.531 0 0 0 1.258-1.258c.11-.296.17-.612.17-.94 0-1.785 1.448-3.233 3.233-3.233 1.785 0 3.232 1.448 3.232 3.232 0 .328.06.644.17.94a2.532 2.532 0 0 0 1.259 1.258c.296.11.612.17.94.17 1.528 0 2.501-1.49 2.048-2.905-.187-.795-.745-1.533-1.393-1.72-.08-1.637-1.393-2.95-3.03-3.03-.804-.04-1.533-.598-1.72-1.393C14.812 5.053 13.527 4 11.999 4Z" /><path d="M12 14.5c-3.038 0-5.5 2.462-5.5 5.5h11c0-3.038-2.462-5.5-5.5-5.5Z" /></svg>
      </div>

      <div className="relative z-10 mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">Perfil del Negocio</h2>
        <p className="text-sm text-gray-500 mt-2 font-medium">Cuéntanos sobre ti o tu empresa. Esta información será pública para los clientes.</p>
      </div>

      <form className="relative z-10">
        <ImageUploader onImageSelect={(file) => updateData('image', file)} />

        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Nombre del Negocio o Proveedor <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400">🏪</span>
            <input 
              type="text" 
              value={formData.businessName}
              onChange={(e) => updateData('businessName', e.target.value)}
              placeholder="Ej: Paseos Felices Lima"
              className="w-full bg-[#F9FAFB] border border-transparent hover:border-gray-200 pl-11 p-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006D44]/20 focus:border-[#006D44] transition-all" 
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Descripción Corta <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea 
              value={formData.description}
              onChange={(e) => updateData('description', e.target.value.substring(0, MAX_DESC))}
              placeholder="Describe brevemente tu experiencia y lo que te hace especial cuidando mascotas..."
              className="w-full bg-[#F9FAFB] border border-transparent hover:border-gray-200 p-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006D44]/20 focus:border-[#006D44] min-h-[120px] resize-none transition-all pb-8"
            />
            <span className={`absolute bottom-3 right-4 text-xs font-bold ${currentLength >= MAX_DESC ? 'text-red-500' : currentLength > 250 ? 'text-amber-500' : 'text-gray-400'}`}>
              {currentLength}/{MAX_DESC} caracteres
            </span>
          </div>
        </div>

        <ZoneSelector 
          selectedZones={formData.zones} 
          onToggleZone={(zone) => {
            const newZones = formData.zones.includes(zone) 
              ? formData.zones.filter(z => z !== zone)
              : [...formData.zones, zone];
            updateData('zones', newZones);
          }} 
        />

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <button type="button" className="text-sm font-bold text-[#006D44] hover:text-[#005233] px-4 py-2">
            Cancelar
          </button>
          <button 
            type="button"
            onClick={onNext}
            className="bg-[#006D44] hover:bg-[#005233] text-white text-sm font-bold py-3 px-8 rounded-xl shadow-md transition-colors flex items-center"
          >
            Siguiente Paso <span className="ml-2 font-bold">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}