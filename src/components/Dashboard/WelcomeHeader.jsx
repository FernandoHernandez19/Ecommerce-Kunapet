import React from 'react';

export default function WelcomeHeader({ clientName, scheduledServicesCount }) {
  // Lógica UX: Cambiar el mensaje según la cantidad de servicios activos
  const getSubtext = () => {
    if (scheduledServicesCount === 0) {
      return "Es un gran día para explorar nuevos servicios para tus peludos.";
    }
    if (scheduledServicesCount === 1) {
      return (
        <>
          Es un gran día para mimar a tus peludos. Tienes{" "}
          <span className="text-brand-primary font-bold">1 servicio</span> programado para hoy.
        </>
      );
    }
    return (
      <>
        Es un gran día para tus peludos. Tienes{" "}
        <span className="text-brand-primary font-bold">{scheduledServicesCount} servicios</span> programados para hoy.
      </>
    );
  };

  return (
    <header className="mb-8" aria-label="Bienvenida al usuario">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
        ¡Hola, {clientName}!
      </h1>
      <p className="mt-2 text-sm text-gray-600 font-medium">
        {getSubtext()}
      </p>
    </header>
  );
}