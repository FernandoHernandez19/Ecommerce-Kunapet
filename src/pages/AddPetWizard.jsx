import React, { useState } from 'react';
import WizardLayout from '../layouts/WizardLayout';
import WizardStepper from '../components/Pets/WizardStepper';
import StepBasicInfo from '../components/Pets/StepBasicInfo';
import StepHealthCare from '../components/Pets/StepHealthCare';

export default function AddPetWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estado centralizado de todo el formulario
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    dob: '',
    weight: '',
    isSterilized: true,
    vaccines: ['Antirrábica'],
    allergies: '',
    specialNeeds: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Aquí podrías agregar validaciones (ej. validar que "name" no esté vacío)
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    console.log("Cerrando el wizard...");
  };

  return (
    <WizardLayout onBack={handlePrev} onClose={handleClose}>
      
      {/* Componente Stepper centralizado unificando el diseño */}
      <WizardStepper currentStep={currentStep} />
      
      {/* Renderizado condicional de los pasos */}
      <div className="w-full">
        {currentStep === 1 && (
          <StepBasicInfo 
            formData={formData} 
            updateData={updateFormData} 
            onNext={handleNext} 
          />
        )}
        
        {currentStep === 2 && (
          <StepHealthCare 
            formData={formData} 
            updateData={updateFormData} 
            onNext={() => console.log('Ir a Paso 3 (Fotos)', formData)} 
            onPrev={handlePrev} 
          />
        )}

        {/* El Paso 3 (Fotos) se renderizaría aquí */}
      </div>

    </WizardLayout>
  );
}