import React from 'react';

export default function WizardSummaryCard({ petData }) {
  // En un entorno real, estos vendrían del estado global del Wizard (formData)
  const previewName = petData.name || 'Tu mascota';
  const previewBreed = petData.breed || 'Raza no especificada';
  const previewAge = petData.age || 'Edad no especificada';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
        <h2 className="text-xl font-extrabold text-gray-900">Resumen</h2>
        <span className="text-[#e23d28]">📋</span>
      </div>

      {/* Mini Perfil */}
      <div className="bg-[#F8F9FA] rounded-xl p-4 flex items-center space-x-4 mb-6 border border-gray-100">
        <div className="w-14 h-14 rounded-full bg-red-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
          {petData.photo ? (
            <img src={petData.photo} alt={previewName} className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xl">🐾</span>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-gray-900 text-lg truncate">{previewName}</h3>
          <p className="text-[11px] text-gray-500 font-medium truncate">
            {previewBreed} • {previewAge}
          </p>
        </div>
      </div>

      {/* Checklist de Progreso */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Paso 1: Info Básica</span>
          <span className="w-5 h-5 rounded-full bg-red-50 text-[#e23d28] flex items-center justify-center text-xs border border-[#e23d28]">✓</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Paso 2: Salud y Vacunas</span>
          <span className="w-5 h-5 rounded-full bg-red-50 text-[#e23d28] flex items-center justify-center text-xs border border-[#e23d28]">✓</span>
        </div>
        <div className="flex items-center justify-between bg-red-50/50 -mx-2 px-2 py-2 rounded-lg border border-red-100">
          <span className="text-sm font-bold text-[#e23d28]">Paso 3: Comportamiento</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#e23d28] animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}