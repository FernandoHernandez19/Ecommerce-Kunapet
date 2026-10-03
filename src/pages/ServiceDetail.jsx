import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavbarHeader';
import ServiceGallery from '../components/Service/ServiceGallery';
import ServiceInfo from '../components/Service/ServiceInfo';
import ServiceDescription from '../components/Service/ServiceDescription';
import ProviderProfileCard from '../components/ProviderProfileCard';
import BookingWidget from '../components/BookingWidget';
import AddToCartWidget from '../components/AddToCartWidget';
import ReviewsSection from '../components/Service/ReviewsSection';
import RelatedServices from '../components/Service/RelatedServices';
import { mockMarketplaceItems } from '../data/mockData';


export default function ServiceDetailPage(){
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch a la API para obtener el detalle del servicio o producto
    const fetchServiceData = async () => {
      try {
        // Buscamos el ítem por id en los mock data
        const foundItem = mockMarketplaceItems.find((item) => String(item.id) === String(id));
        setService(foundItem || null);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!service) return <div className="text-center py-12">Ítem no encontrado</div>;

  const isService = service.category && service.category.toLowerCase().includes('servicio');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
      {/* El Navbar general de tu app se renderiza arriba de este componente en el Layout o App.jsx */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <a href="/" className="hover:text-brand-primary transition-colors">Inicio</a>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <a href="/marketplace" className="hover:text-brand-primary transition-colors">Marketplace</a>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-500">{service.category}</span>
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
            {isService ? (
              <BookingWidget 
                basePrice={service.basePrice}
                serviceFee={service.serviceFee}
                serviceId={service.id}
                item={service}
              />
            ) : (
              <AddToCartWidget 
                basePrice={service.basePrice}
                serviceFee={service.serviceFee}
                serviceId={service.id}
                item={service}
              />
            )}
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




