import React from 'react';

export default function PetCard({ pet }) {
  // Función para determinar estilos según el tipo de animal
  const isDog = pet.type === 'Perro';
  const defaultImage = isDog 
    ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120' 
    : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120';

  return (
    <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
      {/* Avatar de la mascota */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white shadow-inner">
        <img 
          src={pet.photoUrl || defaultImage} 
          alt={pet.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      {/* Detalles */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-gray-950 text-base truncate">{pet.name}</h3>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            isDog ? 'bg-red-50 text-brand-primary' : 'bg-amber-50 text-amber-700'
          }`}>
            {pet.type}
          </span>
          <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[80px]" title={pet.breed}>
            {pet.breed}
          </span>
        </div>
        
        {/* Metadatos inferiores */}
        <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-50">
          <div>
            <p className="text-gray-400 font-medium">Edad</p>
            <p className="font-bold text-gray-800">{pet.age}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-medium">Próxima Vacuna</p>
            <p className={`font-bold ${pet.status === 'warning' ? 'text-amber-600' : 'text-brand-primary'}`}>
              {pet.status === 'warning' ? `📅 ${pet.nextVaccine}` : `✓ ${pet.nextVaccine}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}