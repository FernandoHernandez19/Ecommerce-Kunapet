import React, { useState } from 'react';
import ProviderOnboardingLayout from '../layouts/ProviderOnboardingLayout';
import RegistrationStepper from '../components/Provider/RegistrationStepper';
import StepBusinessProfile from '../components/Provider/StepBusinessProfile';

export default function ProviderRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estado global del formulario de negocio
  const [formData, setFormData] = useState({
    image: null,
    businessName: '',
    description: '',
    zones: ['Miraflores'] // Pre-seleccionado como en la imagen
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validaciones simples antes de avanzar
    if (!formData.businessName || !formData.description || formData.zones.length === 0) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProviderOnboardingLayout>
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Registro de Proveedor</h1>
        <p className="text-gray-500 font-medium">Únete a la comunidad de KunaPet y conecta con dueños de mascotas increíbles.</p>
      </div>

      <RegistrationStepper currentStep={currentStep} />

      <div className="max-w-3xl mx-auto">
        {currentStep === 1 && (
          <StepBusinessProfile 
            formData={formData}
            updateData={updateFormData}
            onNext={handleNextStep}
          />
        )}
        
        {/* Futuros pasos */}
        {currentStep === 2 && (
          <div className="text-center p-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Paso 2: Servicios</h2>
            <button onClick={() => setCurrentStep(1)} className="mt-4 text-[#e23d28] font-bold">Volver</button>
          </div>
        )}
      </div>
    </ProviderOnboardingLayout>
  );
}