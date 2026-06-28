import React, { useState } from 'react';
import BehaviorTags from '../components/Pets/BehaviorTags';
import PetBioField from '../components/Pets/PetBioField';
import WizardSummaryCard from '../components/Pets/WizardSummaryCard';

export default function StepBehaviorPage({ formData, updateData, onPrev, onSubmit }) {
  // Estado local para simular la carga (Mejora UX 2)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleTrait = (traitId) => {
    const currentTraits = formData.traits || [];
    const newTraits = currentTraits.includes(traitId)
      ? currentTraits.filter(id => id !== traitId)
      : [...currentTraits, traitId];
    
    updateData('traits', newTraits);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // Simulamos un retraso de red (fetch a tu backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit();
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Título de Sección */}
      <div className="mb-10 mt-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Comportamiento y Personalidad</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Ayúdanos a conocer mejor a tu mascota para encontrar los servicios ideales.
        </p>
      </div>

      {/* Grid Layout 8/4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Columna Izquierda: Formularios */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <BehaviorTags 
            selectedTraits={formData.traits || []} 
            onToggleTrait={handleToggleTrait} 
          />
          <PetBioField 
            bio={formData.bio || ''} 
            onBioChange={(val) => updateData('bio', val)} 
          />
        </div>

        {/* Columna Derecha: Sidebar Resumen */}
        <div className="lg:col-span-4">
          <WizardSummaryCard petData={formData} />
        </div>

      </div>

      {/* Footer / Navegación */}
      <div className="flex justify-between items-center w-full pt-6 border-t border-gray-200">
        <button 
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50"
        >
          ← Atrás
        </button>
        <button 
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className={`text-white text-sm font-bold py-3 px-8 rounded-full shadow-md transition-all flex items-center justify-center min-w-[200px] ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#006D44] hover:bg-[#005233]'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Guardando...
            </>
          ) : (
            <>Completar Registro <span className="ml-2">✓</span></>
          )}
        </button>
      </div>
    </div>
  );
}