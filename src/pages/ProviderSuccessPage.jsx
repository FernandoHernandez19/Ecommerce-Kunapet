import React from 'react';
import SuccessCard from '../components/Provider/SuccessCard';
import FinalStepper from '../components/Provider/FinalStepper';

export default function ProviderSuccessPage() {
  
  const handleGoToDashboard = () => {
    console.log("Navegando al Dashboard del Proveedor...");
    // Implementación real: 
    // window.location.replace('/provider-dashboard'); 
    // o navigate('/provider-dashboard', { replace: true });
  };

  const handleViewProfile = () => {
    console.log("Redirigiendo a la vista previa del perfil público...");
    // Implementación real:
    // navigate('/provider-profile/preview');
  };

  return (
    <div 
      className="min-h-screen font-sans flex flex-col items-center justify-center p-6"
      // Mejora UX 3: Patrón de puntos generado por CSS (sin imágenes)
      style={{
        backgroundColor: '#FAFAFA',
        backgroundImage: 'radial-gradient(#E5E7EB 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="w-full flex flex-col items-center z-10">
        
        {/* Tarjeta Principal */}
        <SuccessCard 
          onGoToDashboard={handleGoToDashboard}
          onViewProfile={handleViewProfile}
        />
        
        {/* Indicador de 4 guiones */}
        <FinalStepper />

      </div>
    </div>
  );
}