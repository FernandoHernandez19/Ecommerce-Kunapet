import React, { useState } from 'react';
import { Trash2, ShieldCheck, ChevronRight } from 'lucide-react';
import PetSelector from './PetSelector';

export default function StepCartReview({ items, onNext }) {
  const services = items.filter(item => item.type === 'service');
  const products = items.filter(item => item.type === 'product');

  // Estado local para los pets seleccionados (en un entorno real esto iría al estado global)
  const [selectedPets, setSelectedPets] = useState({});

  const handleSelectPet = (itemId, petId) => {
    setSelectedPets(prev => ({ ...prev, [itemId]: petId }));
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Revisa tu carrito</h1>
      <p className="text-sm text-gray-500 mb-6">Asigna tus servicios a tus mascotas y confirma tus productos.</p>
      
      {services.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Servicios Contratados</h2>
          <div className="space-y-6">
            {services.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex gap-4 mb-4 pb-4 border-b border-gray-50">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-brand-secondary font-medium">{item.subtitle}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{item.price}</p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors self-start p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Asignación de Mascota */}
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-brand-secondary" />
                    Asignar mascota para este servicio:
                  </p>
                  <PetSelector 
                    selectedPet={selectedPets[item.id]} 
                    onSelectPet={(petId) => handleSelectPet(item.id, petId)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Productos Físicos</h2>
          <div className="space-y-4">
            {products.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-center">
                <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.price}</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors p-2 ml-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lg:hidden mt-6">
        <button 
          onClick={onNext}
          className="w-full bg-brand-secondary text-white font-bold py-4 rounded-xl shadow-md flex justify-center items-center gap-2"
        >
          Continuar al Despacho <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
