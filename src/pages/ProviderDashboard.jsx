import React from 'react';
import ProviderDashboardLayout from '../layouts/ProviderDashboardLayout';
import DashboardHeader from '../components/Provider/DashboardHeader';
import MetricCards from '../components/Provider/MetricCards';
import TodayAgenda from '../components/Provider/TodayAgenda';
import BusinessWidgets from '../components/Provider/BusinessWidgets';
import RecentOrders from '../components/Provider/RecentOrders';
import { Button } from '../components/ui';
import { Plus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  
  // Simulación de datos (Mock Data)
  const dashboardData = {
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

  const businessName = user?.name || "PetShop Central";

  return (
    <ProviderDashboardLayout>
      
      {/* Header Reutilizable */}
      <DashboardHeader 
        title={`¡Hola, ${businessName}! 👋`}
        subtitle="Tienes un gran día por delante. Hoy hay 12 citas programadas y 4 pedidos pendientes de envío."
        action={
          <Button variant="primary" size="md" leftIcon={<Plus size={18} />}>
            Nuevo Servicio
          </Button>
        }
      />

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

    </ProviderDashboardLayout>
  );
}