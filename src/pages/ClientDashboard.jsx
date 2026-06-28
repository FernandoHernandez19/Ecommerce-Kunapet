import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import PetGrid from '../components/Dashboard/PetGrid';
import ActivityTimeline from '../components/Dashboard/ActivityTimeline';
import useAuthStore from '../store/useAuthStore'; // <-- Integración de Auth

export default function ClientDashboard() {
  const { user } = useAuthStore(); // Usuario real
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch de datos de la sesión del cliente (mascotas, actividades)
    const fetchDashboardData = async () => {
      try {
        const mockData = {
          scheduledServicesCount: 1,
          pets: [
            { id: 'p1', name: 'Luna', type: 'Perro', breed: 'Golden Retriever', age: '2 años', nextVaccine: 'Oct 15', status: 'warning' },
            { id: 'p2', name: 'Milo', type: 'Gato', breed: 'Mestizo', age: '4 años', nextVaccine: 'Al día', status: 'success' }
          ],
          activities: [
            { id: 'a1', time: 'HOY, 14:00', title: 'Paseo de 1 hora', details: 'Para Luna con Carlos M.', status: 'EN CURSO' },
            { id: 'a2', time: 'AYER', title: 'Consulta Veterinaria', details: 'Para Milo en VetClinic', status: 'COMPLETADO' },
            { id: 'a3', time: '12 SEP', title: 'Alimento Premium 15kg', details: 'Tienda KunaPet', status: 'ENTREGADO' }
          ],
          paymentMethod: { type: 'Visa', lastFour: '4242' }
        };
        // Simulamos retardo de red
        await new Promise(resolve => setTimeout(resolve, 600));
        setDashboardData(mockData);
      } catch (error) {
        console.error("Error al cargar el dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  // Fallback seguro si user es nulo
  const clientFirstName = user?.name ? user.name.split(' ')[0] : 'Cliente';

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Panel Lateral de Navegación */}
      <Sidebar user={user} />

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-6 md:p-10 lg:ml-64">
        {/* Encabezado de Bienvenida */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            ¡Hola, {clientFirstName}!
          </h1>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Es un gran día para mimar a tus peludos. Tienes{' '}
            <span className="text-emerald-700 font-bold">{dashboardData.scheduledServicesCount} servicio</span> programado para hoy.
          </p>
        </header>

        {/* Distribución en Rejilla (Dashboard Layout) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* Sección Izquierda/Centro: Mascotas y Accesos Rápidos (Ocupa 2 columnas en xl) */}
          <div className="xl:col-span-2 space-y-8">
            <PetGrid pets={dashboardData.pets} />

            {/* Accesos Rápidos Inferiores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    👤
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Ajustes de Perfil</h4>
                    <p className="text-xs text-gray-400">Dirección, notificaciones y seguridad</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
              </button>

              <button className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    💳
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Métodos de Pago</h4>
                    <p className="text-xs text-gray-400">{dashboardData.paymentMethod.type} terminada en **** {dashboardData.paymentMethod.lastFour}</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
              </button>
            </div>
          </div>

          {/* Sección Derecha: Línea de tiempo de Actividad (Ocupa 1 columna) */}
          <div className="xl:col-span-1">
            <ActivityTimeline activities={dashboardData.activities} />
          </div>

        </div>
      </main>
    </div>
  );
}