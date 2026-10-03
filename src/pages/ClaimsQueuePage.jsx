import React from 'react';
import ClaimsAdminLayout from '../layouts/ClaimsAdminLayout';
import FilterPanel from '../components/Claims/FilterPanel';
import ClaimsTable from '../components/Claims/ClaimsTable';

export default function ClaimsQueuePage() {
  // Mock Data basada en la imagen, enriquecida para soportar las mejoras de UX
  const claimsData = [
    { 
      id: '#CLM-8924', date: '24 Oct 2023', 
      clientInitials: 'MR', client: 'María Rodríguez', avatarColor: 'bg-emerald-400',
      provider: 'Paseos Felices SL', 
      status: 'Nuevo', priority: 'Alta' 
    },
    { 
      id: '#CLM-8921', date: '23 Oct 2023', 
      clientInitials: 'CG', client: 'Carlos Gómez', avatarColor: 'bg-amber-600',
      provider: 'PetShop Central', 
      status: 'En Investigación', priority: 'Media' 
    },
    { 
      id: '#CLM-8915', date: '21 Oct 2023', 
      clientInitials: 'AL', client: 'Ana López', avatarColor: 'bg-gray-400',
      provider: 'Clínica Veterinaria S...', 
      status: 'Nuevo', priority: 'Baja' 
    }
  ];

  return (
    <ClaimsAdminLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-full items-start">
        {/* Panel Izquierdo: Filtros */}
        <FilterPanel />
        
        {/* Panel Derecho: Tabla de Datos */}
        <ClaimsTable claims={claimsData} />
      </div>
    </ClaimsAdminLayout>
  );
}