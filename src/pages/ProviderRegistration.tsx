import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { validateCredentials } from '../utils/accountValidation';
import ProviderOnboardingLayout from '../layouts/ProviderOnboardingLayout';
import RegistrationStepper from '../components/Provider/RegistrationStepper';
import StepBusinessProfile from '../components/Provider/StepBusinessProfile';
import type { ProviderFormErrors, ProviderRegistrationData, UpdateProviderData } from '../components/Provider/types';

export default function ProviderRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estado global del formulario de negocio
  const [formData, setFormData] = useState<ProviderRegistrationData>({
    image: null,
    businessName: '',
    email: '',
    password: '',
    description: '',
    zones: ['Miraflores'] // Pre-seleccionado como en la imagen
  });

  const updateFormData: UpdateProviderData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [errors, setErrors] = useState<ProviderFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Crea la cuenta (rol provider) e inicia sesión. Es el último paso implementado del flujo.
  const handleNextStep = async () => {
    const newErrors: ProviderFormErrors = validateCredentials(formData);
    const name = formData.businessName.trim();
    if (!name || !formData.description.trim() || formData.zones.length === 0) {
      setSubmitError('Por favor completa los campos obligatorios.');
    } else {
      setSubmitError(null);
    }
    if (name.length < 2 && name) newErrors.businessName = 'El nombre debe tener al menos 2 caracteres.';
    setErrors(newErrors);
    if (!name || !formData.description.trim() || formData.zones.length === 0 || Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await register({
      name,
      email: formData.email,
      password: formData.password,
      role: 'provider',
    });
    setIsSubmitting(false);
    if (result.success) {
      navigate('/provider-success', { replace: true });
    } else {
      setSubmitError(result.error);
    }
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
        {submitError && (
          <div role="alert" className="flex items-start gap-3 p-4 mb-6 bg-danger-light border border-danger/20 rounded-2xl">
            <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm font-medium text-danger-text">{submitError}</p>
          </div>
        )}
        {currentStep === 1 && (
          <StepBusinessProfile 
            formData={formData}
            updateData={updateFormData}
            onNext={handleNextStep}
            errors={errors}
            isSubmitting={isSubmitting}
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