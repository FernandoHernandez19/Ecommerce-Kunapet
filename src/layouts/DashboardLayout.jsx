import React from 'react';
// FIX: Corregido el nombre del archivo (era 'Sidebar/Sidebar' pero el archivo se llamaba 'Siderbar.jsx')
import Sidebar from '../components/Sidebar/Sidebar';
// FIX: Componente ahora existe en src/components/Dashboard/MobileNavigation.jsx
import MobileNavigation from '../components/Dashboard/MobileNavigation';

/**
 * DashboardLayout — Layout principal para las páginas del cliente autenticado.
 * - Desktop: Sidebar fijo a la izquierda (w-64)
 * - Mobile: Barra de navegación inferior fija
 * Props:
 *  - children  {ReactNode}  Contenido de la página
 *  - user      {object}     Datos del usuario para el Sidebar (avatar, clientName)
 */
export default function DashboardLayout({ children, user }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 pb-20 lg:pb-0">
      {/* Navegación Desktop (oculta en móvil) */}
      <Sidebar user={user} />

      {/* Contenido principal desplazado a la derecha del sidebar en desktop */}
      <main className="flex-1 p-5 md:p-10 lg:ml-64">
        {children}
      </main>

      {/* Navegación Mobile (oculta en desktop) */}
      <MobileNavigation />
    </div>
  );
}
