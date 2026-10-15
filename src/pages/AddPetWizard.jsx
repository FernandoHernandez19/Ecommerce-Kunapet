import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardLayout from '../layouts/WizardLayout';
import WizardStepper from '../components/Pets/WizardStepper';
import StepBasicInfo from '../components/Pets/StepBasicInfo';
import StepHealthCare from '../components/Pets/StepHealthCare';
import usePetsStore from '../store/usePetsStore';
import { friendlyMessage } from '../api/errorMessages';

export default function AddPetWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const addPet = usePetsStore((state) => state.addPet);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (currentStep === 1) {
      if (!formData.name.trim()) return setSubmitError('El nombre de la mascota es obligatorio.');
      if (!formData.species) return setSubmitError('Selecciona la especie de tu mascota.');
      if (formData.dob && formData.dob > new Date().toISOString().slice(0, 10)) {
        return setSubmitError('La fecha de nacimiento no puede ser futura.');
      }
    }
    setSubmitError(null);
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // ── Finalizar wizard: crea la mascota con POST /pets y vuelve al dashboard ──
  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await addPet(formData);
      navigate('/clientdashboard', { state: { tab: 'pets' } });
    } catch (err) {
      setSubmitError(friendlyMessage(err));
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate('/clientdashboard');
  };

  return (
    <WizardLayout onBack={handlePrev} onClose={handleClose}>
      
      {/* Componente Stepper centralizado unificando el diseño */}
      <WizardStepper currentStep={currentStep} />

      {submitError && (
        <div role="alert" className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {submitError}
        </div>
      )}
      
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
            onNext={handleFinish}
            onPrev={handlePrev} 
            isSubmitting={isSubmitting}
          />
        )}

        {/* El Paso 3 (Fotos) se renderizaría aquí */}
      </div>

    </WizardLayout>
  );
}
