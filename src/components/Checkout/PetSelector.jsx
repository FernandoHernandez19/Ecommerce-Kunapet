import React from 'react';

export default function PetSelector({ selectedPet, onSelectPet }) {
  const pets = [
    { id: 'luna', name: 'Para Luna', icon: '🐕' },
    { id: 'milo', name: 'Para Milo', icon: '🐈' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center mb-2">
        <span className="text-[#e23d28] mr-2">🐰</span> ¿Para quién es este pedido?
      </h2>
      <p className="text-sm text-gray-500 mb-5 font-medium">Selecciona las mascotas asociadas a los servicios de esta compra.</p>
      
      <div className="flex flex-wrap gap-3">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelectPet(pet.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-bold transition-colors outline-none focus:ring-2 focus:ring-[#e23d28] focus:ring-offset-1 ${
              selectedPet === pet.id 
                ? 'bg-red-100 border-[#e23d28] text-[#e23d28]' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">{pet.icon}</span>
            <span>{pet.name}</span>
          </button>
        ))}
        
        <button className="flex items-center space-x-2 px-4 py-2 rounded-full border border-dashed border-gray-300 text-sm font-bold text-[#e23d28] hover:bg-gray-50 hover:border-[#e23d28] transition-colors">
          <span>+ Agregar mascota</span>
        </button>
      </div>
    </div>
  );
}