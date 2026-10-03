import React from 'react';
import ClaimsAdminLayout from '../layouts/ClaimsAdminLayout'; // El mismo de la vista de "Cola"
import ClaimHeader from '../components/Claims/ClaimHeader';
import ClaimSummary from '../components/Claims/ClaimSummary';
import ClaimTimeline from '../components/Claims/ClaimTimeline';
import ResolutionPanel from '../components/Claims/ResolutionPanel';

export default function ClaimDetailsPage() {
  // Mock Data: Simulando los datos provenientes de la base de datos
  const claimData = {
    id: "#CLM-8924",
    status: "En Proceso",
    priority: "Alta",
    openedAt: "24 Oct 2024, 14:30",
    lastUpdated: "Hace 2 horas",
    client: { name: "María Rodríguez", uid: "CUS-4921" },
    provider: { name: "Paseos Felices SL", pid: "PRV-882" },
    motive: "El servicio no coincide con la descripción",
    motiveDescription: "El paseador llegó 45 minutos tarde, reduciendo el tiempo de paseo de mi perro de 1 hora a solo 15 minutos, pero se cobró el servicio completo.",
    timelineEvents: [
      {
        icon: '⚐',
        title: 'Reclamo Iniciado por Cliente',
        timestamp: '24 Oct, 14:30',
        description: 'María Rodríguez abrió el reclamo referenciando la reserva #RES-99210.',
        image: null
      },
      {
        icon: '🖼',
        title: 'Evidencia Adjuntada',
        timestamp: '24 Oct, 14:35',
        description: 'Captura de pantalla de la app mostrando la ruta GPS del paseador.',
        image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400' // Placeholder de un mapa
      }
    ]
  };

  return (
    <ClaimsAdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Cabecera superior */}
        <ClaimHeader 
          claimId={claimData.id}
          status={claimData.status}
          priority={claimData.priority}
          openedAt={claimData.openedAt}
          lastUpdated={claimData.lastUpdated}
        />

        {/* Layout de contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start bg-[#F8F9F8] p-6 rounded-3xl border border-gray-100">
          
          {/* Columna Izquierda (Contexto) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ClaimSummary 
              client={claimData.client}
              provider={claimData.provider}
              motive={claimData.motive}
              motiveDescription={claimData.motiveDescription}
            />
            
            <ClaimTimeline events={claimData.timelineEvents} />
          </div>

          {/* Columna Derecha (Acción) */}
          <div className="lg:col-span-1">
            <ResolutionPanel />
          </div>
          
        </div>
      </div>
    </ClaimsAdminLayout>
  );
}