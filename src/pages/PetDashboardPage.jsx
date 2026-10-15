import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PetHeroCard from '../components/PetDashboard/PetHeroCard';
import MedicalTab from '../components/PetDashboard/MedicalTab';
import DietBehaviorTab from '../components/PetDashboard/DietBehaviorTab';
import LiveServiceWidget from '../components/PetDashboard/LiveServiceWidget';
import useAuthStore from '../store/useAuthStore';
import usePetsStore from '../store/usePetsStore';
import Sidebar from '../components/Sidebar/Sidebar';

// Las alergias viven dentro de `notes` (línea «Alergias: …»), tal como las guarda el wizard.
const allergiesFrom = (notes) =>
  (notes || '').split('\n').find((l) => l.startsWith('Alergias:'))?.replace('Alergias:', '').trim() ?? '';

export default function PetDashboardPage() {
  const [activeTab, setActiveTab] = useState('salud');
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId');

  const pets = usePetsStore((s) => s.pets);
  const status = usePetsStore((s) => s.status);
  const error = usePetsStore((s) => s.error);
  const fetchPets = usePetsStore((s) => s.fetchPets);

  useEffect(() => {
    const controller = new AbortController();
    fetchPets(controller.signal);
    return () => controller.abort();
  }, [fetchPets]);

  const pet = pets.find((p) => p.id === petId) ?? pets[0] ?? null;

  let content;
  if (status === 'loading' && !pet) {
    content = <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" role="status" aria-label="Cargando mascota" />;
  } else if (status === 'error') {
    content = (
      <div role="alert" className="bg-white border border-red-100 rounded-2xl p-8 text-center">
        <p className="text-sm font-medium text-red-600 mb-4">{error}</p>
        <button onClick={() => fetchPets()} className="px-5 py-2.5 text-sm font-bold text-white rounded-xl bg-[#006D44]">Reintentar</button>
      </div>
    );
  } else if (!pet) {
    content = (
      <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
        <p className="text-3xl mb-3" aria-hidden="true">🐾</p>
        <h2 className="text-lg font-bold text-gray-900">Aún no tienes mascotas registradas</h2>
        <Link to="/add-pet" className="inline-block mt-4 px-5 py-2.5 text-sm font-bold text-white rounded-xl bg-[#006D44] no-underline">
          Añadir mascota
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <PetHeroCard pet={pet} onEdit={() => navigate('/clientdashboard', { state: { tab: 'pets' } })} />

          <div className="flex border-b border-gray-100 mb-6" role="tablist">
            {[['salud', '🏥 Historial Médico'], ['dieta', '🍖 Notas de cuidado']].map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 outline-none transition-all ${activeTab === id
                  ? 'border-[#006D44] text-[#006D44]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white p-2 rounded-2xl">
            {activeTab === 'salud' && <MedicalTab medicalRecords={{ allergies: allergiesFrom(pet.notes), vaccines: pet.vaccines }} />}
            {activeTab === 'dieta' && <DietBehaviorTab notes={pet.notes} />}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-2">
          <LiveServiceWidget activeService={null} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar user={user} />
      <main className="flex-1 p-6 md:p-10 lg:ml-64">
        <div className="min-h-screen bg-[#FDFDFD] py-8 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-6xl mx-auto">{content}</div>
        </div>
      </main>
    </div>
  );
}
