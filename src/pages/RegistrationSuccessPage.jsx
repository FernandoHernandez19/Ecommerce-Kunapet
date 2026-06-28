import React from 'react';
import SuccessHeader from '../components/Success/SuccessHeader';
import PetSummaryCard from '../components/Success/PetSummaryCard';
import ActionButtons from '../components/Success/ActionButtons';

export default function RegistrationSuccessPage() {
  // Datos simulados provenientes del estado final del Wizard de Registro
  const registeredPet = {
    name: "Luna",
    breed: "Golden Retriever",
    age: "2 años",
    species: "Perro",
    status: "Activa",
    vaccineStatus: "Vacunada",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&q=80"
  };

  const handleGoToDashboard = () => {
    // Aquí aplicarías la Mejora 2: history.replace('/dashboard')
    console.log("Redirigiendo al panel principal y limpiando historial...");
    window.location.href = '/dashboard';
  };

  const handleAddAnother = () => {
    console.log("Reiniciando el wizard de registro...");
    window.location.href = '/registrar-mascota';
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Elemento Decorativo (Mejora 1: Placeholder para efecto Confeti) */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-300 via-emerald-400 to-yellow-300 opacity-50"></div>
      
      <div className="w-full max-w-lg z-10 animate-fade-in-up">
        
        <SuccessHeader petName={registeredPet.name} />
        
        <PetSummaryCard pet={registeredPet} />
        
        <ActionButtons 
          onGoToDashboard={handleGoToDashboard} 
          onAddAnother={handleAddAnother} 
        />
        
      </div>
    </div>
  );
}