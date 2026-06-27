import React from 'react';
import SuccessHero from '../components/Order/SuccessHero';
import OrderSummaryCard from '../components/Order/OrderSummaryCard';
import DeliveryCard from '../components/Order/DeliveryCard';
import ServiceCard from '../components/Order/ServiceCard';
import ActionButtons from '../components/Order/ActionButtons';
// import MainLayout from '../layouts/MainLayout'; (Omitido para no alargar el bloque, pero envuelve este componente)

export default function OrderConfirmationPage() {
  // Datos simulados (Mock Data) que vendrían del estado de tu carrito/backend
  const orderData = {
    orderId: "ORD-7721",
    date: "24 Oct, 2026",
    items: [
      {
        title: "Alimento Premium Adulto",
        description: "Sabor Pollo y Arroz, 15kg",
        type: "Producto",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&q=80"
      },
      {
        title: "Paseo de 1 hora",
        description: "Parque Central, Grupo pequeño",
        type: "Servicio",
        price: "$15.00",
        icon: "🚶‍♂️"
      }
    ],
    total: "$60.00",
    delivery: {
      address: {
        title: "Casa - Principal",
        line1: "Av. Siempre Viva 742",
        line2: "Springfield, 12345"
      },
      estimatedTime: "Mañana, 09:00 AM - 12:00 PM"
    },
    service: {
      provider: {
        name: "Carlos Mendoza",
        rating: "4.9",
        reviews: "120",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
      },
      schedule: {
        date: "26 Octubre",
        time: "16:00 hrs"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Validación Visual Superior */}
        <SuccessHero orderId={orderData.orderId} date={orderData.date} />

        {/* Layout en Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Columna Izquierda: Resumen Económico */}
          <div>
            <OrderSummaryCard items={orderData.items} total={orderData.total} />
          </div>

          {/* Columna Derecha: Logística y Agenda */}
          <div className="flex flex-col">
            <DeliveryCard 
              address={orderData.delivery.address} 
              estimatedTime={orderData.delivery.estimatedTime} 
            />
            <ServiceCard 
              provider={orderData.service.provider} 
              schedule={orderData.service.schedule} 
            />
          </div>

        </div>

        {/* Botones Finales */}
        <ActionButtons />

      </div>
    </div>
  );
}