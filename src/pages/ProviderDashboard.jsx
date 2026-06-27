import React from 'react';
import ProviderLayout from '../layouts/ProviderLayout';
import MetricCards from '../components/Provider/MetricCards';
import TodayAgenda from '../components/Provider/TodayAgenda';
import BusinessWidgets from '../components/Provider/BusinessWidgets';
import RecentOrders from '../components/Provider/RecentOrders';

export default function ProviderDashboard() {
  // Simulación de datos (Mock Data)
  const dashboardData = {
    businessName: "PetShop Central",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150",
    metrics: { sales: "$45.200", activeServices: 8, rating: 4.9, reviews: 124, messages: 12 },
    appointments: [
      { time: '10:00', meridian: 'AM', service: 'Paseo Premium', pet: 'Bruno (Golden Retriever)', client: 'Juan Pérez', status: 'READY', statusText: 'Iniciar' },
      { time: '14:00', meridian: 'PM', service: 'Baño y Corte', pet: 'Mimi (Persa)', client: 'Ana López', status: 'WAITING', statusText: 'En 3 horas' },
      { time: '16:30', meridian: 'PM', service: 'Consulta Veterinaria', pet: 'Toby (Beagle)', client: 'Carlos Ruiz', status: 'PENDING', statusText: 'Pendiente' }
    ],
    stockAlerts: [
      { name: 'NutriCan Adultos 15kg', quantity: 3, severity: 'high' },
      { name: 'Shampoo Antipulgas 500ml', quantity: 5, severity: 'high' },
      { name: 'Collares Reflectivos', quantity: 12, severity: 'medium' }
    ],
    growth: 14.2,
    orders: [
      { id: '#9402', client: 'Marta López', products: '2x Correa Retráctil, 1x Juguete Mordedor', total: '$1.250', status: 'PENDIENTE', action: '' },
      { id: '#9399', client: 'Roberto García', products: '1x NutriCan Adultos 15kg', total: '$4.800', status: 'EN CAMINO', action: 'Rastrear' },
      { id: '#9395', client: 'Sofía Díaz', products: '4x Latas Alimento Húmedo', total: '$850', status: 'ENTREGADO', action: 'Detalles' }
    ]
  };

  return (
    <ProviderLayout businessName={dashboardData.businessName} avatar={dashboardData.avatar}>
      
      {/* Header Principal de la Página */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
            ¡Hola, {dashboardData.businessName}! <span className="ml-2 text-2xl">👋</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Tienes un gran día por delante. Hoy hay 12 citas programadas y 4 pedidos pendientes de envío.
          </p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-colors flex items-center">
          <span className="mr-2 text-lg">+</span> Nuevo Servicio
        </button>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <MetricCards metrics={dashboardData.metrics} />

      {/* Grilla Central */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Agenda (Ocupa 2 columnas en pantallas grandes) */}
        <div className="xl:col-span-2">
          <TodayAgenda appointments={dashboardData.appointments} />
        </div>
        
        {/* Widgets Derechos (Ocupa 1 columna) */}
        <div className="xl:col-span-1">
          <BusinessWidgets stockAlerts={dashboardData.stockAlerts} growth={dashboardData.growth} />
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <RecentOrders orders={dashboardData.orders} />

      {/* FAB Botón Flotante (Solución a la Mejora 3 UX) */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-2xl shadow-emerald-900/50 flex items-center justify-center text-2xl font-bold transition-transform hover:scale-105 z-50"
        title="Acción rápida"
      >
        +
      </button>

    </ProviderLayout>
  );
}