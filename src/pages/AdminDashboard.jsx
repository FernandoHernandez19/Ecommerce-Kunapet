import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import AdminStatCards from '../components/Admin/AdminStatCards';
import GrowthChart from '../components/Admin/GrowthChart';
import ModerationAlerts from '../components/Admin/ModerationAlerts';

export default function AdminDashboard() {
  // Simulación de los datos del Backend (Ej. tu API en C#)
  const dashboardData = {
    adminName: "Fernando H.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    stats: [
      { title: 'Usuarios Totales', value: '24,592', trend: '12%', icon: '👥', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
      { title: 'Proveedores Activos', value: '1,204', trend: '5%', icon: '🏪', iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
      { title: 'Ingresos Mensuales', value: '$84,320', trend: '18%', icon: '💵', iconBg: 'bg-emerald-800', iconColor: 'text-white' },
      { title: 'Aprobaciones Pendientes', value: '28', urgentCount: '3', icon: '📋', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    ],
    alerts: [
      { 
        severity: 'critical', 
        title: 'Reseña Sospechosa', 
        description: 'Usuario reportó lenguaje inapropiado en servicio de baño.', 
        action: 'Revisar reporte' 
      },
      { 
        severity: 'warning', 
        title: 'Licencia Expirada', 
        description: 'Clínica \'Patitas Sanas\' requiere actualización de documentos legales.', 
        action: 'Solicitar Docs' // Implementación de la mejora UX
      },
      { 
        severity: 'warning', 
        title: 'Múltiples Cancelaciones', 
        description: 'Paseador \'Juan P.\' canceló 3 paseos hoy.', 
        action: 'Ver Perfil' // Implementación de la mejora UX
      }
    ]
  };

  return (
    <AdminLayout adminName={dashboardData.adminName} avatarUrl={dashboardData.avatarUrl}>
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Resumen General</h2>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Bienvenido al panel de control de KunaPet. Aquí tienes un vistazo del rendimiento actual.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <AdminStatCards stats={dashboardData.stats} />

      {/* Contenido Principal en Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Gráfico de Reportes (Ocupa 2 de 3 columnas) */}
        <div className="xl:col-span-2">
          <GrowthChart />
        </div>
        
        {/* Panel de Alertas de Moderación (Ocupa 1 columna) */}
        <div className="xl:col-span-1">
          <ModerationAlerts alerts={dashboardData.alerts} />
        </div>
      </div>
    </AdminLayout>
  );
}