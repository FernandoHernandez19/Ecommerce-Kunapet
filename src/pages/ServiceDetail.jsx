import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavbarHeader';
import ServiceGallery from '../components/Service/ServiceGallery';
import ServiceInfo from '../components/Service/ServiceInfo';
import ServiceDescription from '../components/Service/ServiceDescription';
import ProviderProfileCard from '../components/ProviderProfileCard';
import BookingWidget from '../components/BookingWidget';
import ReviewsSection from '../components/Service/ReviewsSection';
import RelatedServices from '../components/Service/RelatedServices';


export default function ServiceDetailPage(){

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch a la API para obtener el detalle del servicio
    const fetchServiceData = async () => {
      try {
        // Aquí conectarías con tu endpoint de backend
        const mockData = {
          id: "serv_01",
          title: "Paseo Premium en Manada (1 Hora)",
          rating: 4.9,
          reviewsCount: 1211,
          location: "Palermo, Buenos Aires",
          targetDogs: "Perros Medianos y Grandes",
          isBestRated: true,
          basePrice: 12500,
          serviceFee: 500,
          description: "Un paseo diseñado para que tu perro libere energía, socialice de forma segura y disfrute al máximo. Recogemos a tu mascota en la puerta de tu casa y lo llevamos a parques grandes donde conformamos grupos pequeños y equilibrados. Durante la hora de paseo, realizamos juegos, caminatas a buen ritmo y ejercicios básicos de obediencia.",
          extraInfo: "Ideal para perros con alta energía que necesitan más que solo caminar. Todos nuestros paseadores cuentan con certificación en primeros auxilios caninos y llevan agua fresca y bolsas compostables.",
          features: [
            { id: 1, label: "60 Minutos", type: "duration" },
            { id: 2, label: "Alta Actividad", type: "activity" },
            { id: 3, label: "Seguro Incluido", type: "insurance" },
            { id: 4, label: "Reporte Diario", type: "report" }
          ],
          provider: {
            id: "prov_99",
            name: "Carlos Mendoza",
            title: "Paseador Canino Profesional & Adiestrador Básico",
            experience: "3 Años exp.",
            completedWalks: "450+ Paseos",
            isVerified: true,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" // Placeholder profesional
          }
        };
        setService(mockData);
      } catch (error) {
        console.error("Error cargando el servicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (!service) return <div className="text-center py-12">Servicio no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
      {/* El Navbar general de tu app se renderiza arriba de este componente en el Layout o App.jsx */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <a href="/" className="hover:text-emerald-700 transition-colors">Inicio</a>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <a href="/servicios" className="hover:text-emerald-700 transition-colors">Servicios</a>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-800 font-medium" aria-current="page">{service.title}</li>
          </ol>
        </nav>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Detalles del Servicio (2/3 de ancho en desktop) */}
          <div className="lg:col-span-2 space-y-8">
            <ServiceGallery />
            
            <ServiceInfo 
              title={service.title}
              rating={service.rating}
              reviewsCount={service.reviewsCount}
              location={service.location}
              targetDogs={service.targetDogs}
              isBestRated={service.isBestRated}
            />
            
            <ServiceDescription 
              description={service.description}
              extraInfo={service.extraInfo}
              features={service.features}
            />
            
            <ProviderProfileCard provider={service.provider} />
            
            <ReviewsSection />
          </div>

          {/* COLUMNA DERECHA: Widget de Reserva (1/3 de ancho, se mantiene fijo al hacer scroll) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <BookingWidget 
              basePrice={service.basePrice}
              serviceFee={service.serviceFee}
              serviceId={service.id}
            />
          </div>
        </div>

        {/* SECCIÓN INFERIOR: Cross-selling / Recomendaciones */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <RelatedServices />
        </div>
      </main>
    </div>
  );

}




