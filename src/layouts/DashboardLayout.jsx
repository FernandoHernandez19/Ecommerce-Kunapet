import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar'; // Asegúrate de ajustar la ruta
import MobileNavigation from '../components/Dashboard/MobileNavigation';

export default function DashboardLayout({ children, user }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 pb-20 lg:pb-0">
      {/* Navegación Desktop */}
      <Sidebar user={user} />
      
      {/* Contenido Dinámico de la Página */}
      <main className="flex-1 p-5 md:p-10 lg:ml-64">
        {children}
      </main>

      {/* Navegación Mobile */}
      <MobileNavigation />
    </div>
  );
}