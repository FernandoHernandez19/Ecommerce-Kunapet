import React, { useState } from 'react';
import ProviderOnboardingLayout from '../layouts/ProviderOnboardingLayout';
import RegistrationStepper from '../components/Provider/RegistrationStepper';
import StepClientProfile from '../components/Client/StepClientProfile';
import StepClientPets from '../components/Client/StepClientPets';
import StepClientPreferences from '../components/Client/StepClientPreferences';
import StepClientSuccess from '../components/Client/StepClientSuccess';

// Steps propios del flujo de cliente (distintos a los del proveedor)
const CLIENT_STEPS = [
  { id: 1, label: 'Perfil' },
  { id: 2, label: 'Mis Mascotas' },
  { id: 3, label: 'Preferencias' },
  { id: 4, label: '¡Listo!' },
];

// Color verde brand del cliente (distinto al rojo del proveedor)
const CLIENT_ACCENT = '#2D6A4F';
const CLIENT_RING   = 'ring-emerald-50';

export default function ClientRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Paso 1 — Perfil
    image: null,
    fullName: '',
    phone: '',
    city: '',
    // Paso 2 — Mascotas
    pets: [],
    // Paso 3 — Preferencias
    services: [],
    emailNotif: true,
    whatsappNotif: false,
  });

  const updateFormData = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  /**
   * goNext con validación de negocio por paso:
   * — Paso 2: no avanza si no hay mascotas (la regla la maneja StepClientPets,
   *   pero el orquestador también la aplica como segunda línea de defensa).
   */
  const goNext = () => {
    if (currentStep === 2 && formData.pets.length === 0) return; // guarda del orquestador
    setCurrentStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProviderOnboardingLayout>
      {/* Encabezado de la página */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Registro de Cliente
        </h1>
        <p className="text-gray-500 font-medium">
          Únete a KunaPet y brinda el mejor cuidado a tus mascotas.
        </p>
      </div>

      {/* Stepper reutilizado con pasos y colores del cliente */}
      <RegistrationStepper
        currentStep={currentStep}
        steps={CLIENT_STEPS}
        accentColor={CLIENT_ACCENT}
        ringColor={CLIENT_RING}
      />

      {/* Contenido del paso activo */}
      <div className="max-w-3xl mx-auto">
        {currentStep === 1 && (
          <StepClientProfile
            formData={formData}
            updateData={updateFormData}
            onNext={goNext}
          />
        )}
        {currentStep === 2 && (
          <StepClientPets
            formData={formData}
            updateData={updateFormData}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 3 && (
          <StepClientPreferences
            formData={formData}
            updateData={updateFormData}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 4 && (
          <StepClientSuccess formData={formData} />
        )}
      </div>
    </ProviderOnboardingLayout>
  );
}

