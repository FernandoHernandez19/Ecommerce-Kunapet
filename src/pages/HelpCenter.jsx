import React from 'react';
import SupportLayout from '../layouts/SupportLayout';
import HeroSearch from '../components/Support/HeroSearch';
import CategoryCards from '../components/Support/CategoryCards';
import PopularArticles from '../components/Support/PopularArticles';
import ActiveCases from '../components/Support/ActiveCases';

export default function HelpCenter() {
  // Simulamos los datos del ticket que vendrían de tu base de datos
  const activeTicket = {
    id: "Ticket #84920",
    status: "En Revisión",
    subject: "Duda sobre cargo de suscripción",
    updatedAgo: "2 horas"
  };

  return (
    <SupportLayout>
      {/* 1. Buscador Principal */}
      <HeroSearch />

      {/* 2. Filtros Rápidos (Categorías) */}
      <CategoryCards />

      {/* 3. Sección Inferior (Artículos y Widgets) */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Lado Izquierdo: FAQs (Crece para ocupar el espacio disponible) */}
        <PopularArticles />
        
        {/* Lado Derecho: Widget de Usuario (Ancho fijo en escritorio) */}
        <div className="shrink-0">
          <ActiveCases ticket={activeTicket} />
        </div>
        
      </div>
    </SupportLayout>
  );
}