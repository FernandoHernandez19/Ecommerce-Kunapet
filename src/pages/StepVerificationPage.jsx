
import React, { useState } from 'react';
import WizardLayout from '../layouts/WizardLayout';
import StepProgressBar from '../components/Provider/StepProgressBar'; // Componente que creamos en el Paso 1/2
import DocumentUploadCard from '../components/Provider/DocumentUploadCard';
import TrustBanner from '../components/Provider/TrustBanner';

export default function StepVerificationPage() {
  const [currentStep, setCurrentStep] = useState(3);
  
  // Estado que almacena los archivos físicos
  const [documents, setDocuments] = useState({
    identity: null,
    certifications: null,
    insurance: null
  });

  const handleFileUpload = (docId, file) => {
    setDocuments(prev => ({ ...prev, [docId]: file }));
  };

  // Lógica de Validación: Los requeridos son 'identity' y 'insurance'
  const isNextEnabled = documents.identity !== null && documents.insurance !== null;

  const handleNextStep = () => {
    if (!isNextEnabled) return;
    
    // Aquí iría la lógica para enviar el FormData con los archivos al backend
    console.log("Enviando documentos a verificación...", documents);
    
    // Avanzar al último paso (Éxito)
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    console.log("Volviendo a Servicios (Paso 2)");
    // setCurrentStep(2);
  };

  const handleClose = () => {
    console.log("Cerrando el asistente...");
  };

  return (
    <WizardLayout onClose={handleClose}>
      <StepProgressBar currentStep={currentStep} />

      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Verificación de Identidad</h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Para garantizar la confianza y seguridad en nuestra comunidad, necesitamos verificar algunos documentos. Esta información se almacena de forma segura y nunca se comparte públicamente.
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
        
        <div className="space-y-4">
          <DocumentUploadCard 
            id="identity"
            title="Documento de Identidad"
            description="DNI, Pasaporte o RUC para cuentas empresariales. Asegúrate de que la foto sea clara."
            isRequired={true}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>}
            file={documents.identity}
            onFileUpload={handleFileUpload}
          />

          <DocumentUploadCard 
            id="certifications"
            title="Certificaciones Profesionales"
            description="Certificados de adiestramiento, primeros auxilios o diplomas relacionados. Aumenta tu visibilidad."
            isRequired={false}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>}
            file={documents.certifications}
            onFileUpload={handleFileUpload}
          />

          <DocumentUploadCard 
            id="insurance"
            title="Seguro de Responsabilidad"
            description="Póliza de seguro vigente que cubra servicios a terceros y cuidado de mascotas."
            isRequired={true}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>}
            file={documents.insurance}
            onFileUpload={handleFileUpload}
          />
        </div>

        <TrustBanner />

        {/* Navegación Inferior (Separador sutil incluido) */}
        <div className="flex justify-between items-center w-full pt-6 border-t border-gray-200">
          <button 
            onClick={handlePrevStep}
            className="text-gray-500 hover:text-gray-800 text-sm font-bold transition-colors py-2 px-4"
          >
            Atrás
          </button>
          
          <button 
            onClick={handleNextStep}
            disabled={!isNextEnabled}
            className={`text-sm font-bold py-3.5 px-8 rounded-xl transition-all flex items-center shadow-sm ${
              isNextEnabled 
                ? 'bg-[#e23d28] hover:bg-[#c93623] text-white' 
                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            <span>Continuar al paso final</span> <span className="ml-2 font-bold">→</span>
          </button>
        </div>

      </div>
    </WizardLayout>
  );
}