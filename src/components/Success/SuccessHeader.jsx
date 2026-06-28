import React, { useEffect, useState } from 'react';

export default function SuccessHeader({ petName }) {
  const [animate, setAnimate] = useState(false);

  // Activamos una pequeña animación al montar el componente
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col items-center text-center mb-10">
      {/* Icono de Éxito Animado */}
      <div className={`w-24 h-24 bg-emerald-200 rounded-full flex items-center justify-center mb-6 shadow-sm transition-all duration-700 transform ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#e23d28]">
          <path d="M11.999 4c-1.528 0-2.813 1.053-3.155 2.505-.187.795-.916 1.353-1.72 1.393-1.637.08-2.95 1.393-3.03 3.03-.04.804-.598 1.533-1.393 1.72C1.249 13.01 2.222 14.5 3.75 14.5c.328 0 .644-.06.94-.17a2.531 2.531 0 0 0 1.258-1.258c.11-.296.17-.612.17-.94 0-1.785 1.448-3.233 3.233-3.233 1.785 0 3.232 1.448 3.232 3.232 0 .328.06.644.17.94a2.532 2.532 0 0 0 1.259 1.258c.296.11.612.17.94.17 1.528 0 2.501-1.49 2.048-2.905-.187-.795-.745-1.533-1.393-1.72-.08-1.637-1.393-2.95-3.03-3.03-.804-.04-1.533-.598-1.72-1.393C14.812 5.053 13.527 4 11.999 4Z" />
          <path d="M12 14.5c-3.038 0-5.5 2.462-5.5 5.5h11c0-3.038-2.462-5.5-5.5-5.5Z" />
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e23d28] tracking-tight mb-4">
        ¡Mascota Registrada!
      </h1>
      
      <p className="text-gray-600 text-sm sm:text-base max-w-md">
        <span className="font-bold text-gray-800">{petName}</span> ha sido añadida a tu perfil exitosamente. Ahora puedes explorar servicios para ella.
      </p>
    </div>
  );
}