import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PetSelector({ selectedPet, onSelectPet }) {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const pets = [
    { id: 'luna', name: 'Para Luna', icon: '🐕' },
    { id: 'milo', name: 'Para Milo', icon: '🐈' }
  ];

  const handleAddPetClick = () => {
    setIsRedirecting(true);
    // Simular un micro-loading antes de redirigir para darle contexto al usuario
    setTimeout(() => {
      // Navegar a la página de creación de mascotas.
      navigate('/add-pet');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center mb-2">
        ¿Para quién es este pedido?
      </h2>
      <p className="text-sm text-gray-500 mb-5 font-medium">Selecciona las mascotas asociadas a los servicios de esta compra.</p>
      
      <div className="flex flex-wrap gap-3 items-center">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelectPet(pet.id)}
            disabled={isRedirecting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-1 ${
              selectedPet === pet.id 
                ? 'bg-brand-secondary-light/20 border-brand-secondary text-brand-secondary' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            } ${isRedirecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs shadow-sm">{pet.icon}</span>
            <span>{pet.name}</span>
          </button>
        ))}
        
        <div className="relative">
          <button 
            onClick={handleAddPetClick}
            disabled={isRedirecting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border border-dashed text-sm font-bold transition-all ${
              isRedirecting 
                ? 'border-brand-secondary bg-brand-secondary-light/20 text-brand-secondary cursor-wait'
                : 'border-gray-300 text-brand-secondary hover:bg-brand-secondary-light/10 hover:border-brand-secondary'
            }`}
          >
            {isRedirecting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Redirigiendo...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Agregar mascota</span>
              </>
            )}
          </button>

          {/* Micro-tooltip emergente al redirigir */}
          {isRedirecting && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg animate-fade-in-up z-10">
              Saliendo al perfil...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}