import React, { useState } from 'react';
import PetHeroCard from '../components/PetDashboard/PetHeroCard';
import MedicalTab from '../components/PetDashboard/MedicalTab';
import DietBehaviorTab from '../components/PetDashboard/DietBehaviorTab';
import LiveServiceWidget from '../components/PetDashboard/LiveServiceWidget';
import FastBookingCard from '../components/PetDashboard/FastBookingCard';

export default function PetDashboardPage() {
  const [activeTab, setActiveTab] = useState('salud');

  // Datos estructurados simulando la respuesta del backend para "Luna"
  const petData = {
    name: "Luna",
    breed: "Golden Retriever",
    age: "2 años y 4 meses",
    weight: "28.5 kg",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80",
    medical: {
      allergies: "Intolerancia severa a subproductos del trigo y sensibilidad al champú antipulgas genérico.",
      vaccines: [
        { name: "Quíntuple Canina", dateApplied: "12 Ene 2026", nextDue: "12 Ene 2027", status: "Vigente" },
        { name: "Antirrábica", dateApplied: "10 Mar 2025", nextDue: "15 Jul 2026", status: "Próxima" },
        { name: "KC (Tos de las perreras)", dateApplied: "05 Nov 2025", nextDue: "05 Nov 2026", status: "Vigente" }
      ]
    },
    dietBehavior: {
      diet: {
        brand: "Barking Heads Salmon Premium",
        portion: "320g repartidos en dos tandas (mañana/noche)",
        notes: "Mezclar siempre con un chorrito de aceite de salmón para el pelaje. No dar snacks comerciales amarillos."
      },
      behavior: {
        tags: ["Amigable", "Energía Alta", "Miedoso a Motos", "Sociable"],
        notes: "Suele jalar un poco la correa los primeros 10 minutos por la emoción. Se distrae positivamente con pelotas de tenis."
      }
    },
    currentService: {
      title: "Paseo Premium de 1 Hora",
      steps: [
        { label: "Paseador recogió a Luna", completed: true },
        { label: "Ruta activa en Parque El Olivar", completed: true },
        { label: "Camino de retorno a casa", completed: false }
      ],
      provider: {
        name: "Carlos Mendoza",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
      }
    }
  };

  const handleEditProfile = () => {
    console.log("Abriendo modal de edición de perfil...");
  };

  const handleOpenChat = () => {
    console.log("Iniciando conexión WebSockets con el paseador:", petData.currentService.provider.name);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Layout en Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda (Datos Mascota) - Ocupa 8 de 12 subcolumnas */}
          <div className="lg:col-span-8">
            <PetHeroCard pet={petData} onEdit={handleEditProfile} />

            {/* Selector de Pestañas (Mejora UX 2) */}
            <div className="flex border-b border-gray-100 mb-6">
              <button
                onClick={() => setActiveTab('salud')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 outline-none transition-all ${
                  activeTab === 'salud' 
                    ? 'border-[#006D44] text-[#006D44]' 
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                🏥 Historial Médico
              </button>
              <button
                onClick={() => setActiveTab('dieta')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 outline-none transition-all ${
                  activeTab === 'dieta' 
                    ? 'border-[#006D44] text-[#006D44]' 
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                🍖 Dieta & Conducta
              </button>
            </div>

            {/* Renderizado Condicional del Contenido de las Pestañas */}
            <div className="bg-white p-2 rounded-2xl">
              {activeTab === 'salud' && <MedicalTab medicalRecords={petData.medical} />}
              {activeTab === 'dieta' && <DietBehaviorTab data={petData.dietBehavior} />}
            </div>
          </div>

          {/* Columna Derecha (Tracking & Conversión) - Ocupa 4 de 12 subcolumnas */}
          <div className="lg:col-span-4 space-y-6">
            <LiveServiceWidget 
              activeService={petData.currentService} 
              onOpenChat={handleOpenChat} 
            />
            <FastBookingCard />
          </div>

        </div>

      </div>
    </div>
  );
}