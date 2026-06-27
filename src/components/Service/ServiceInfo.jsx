import React from 'react';

const ServiceInfo = ({ title, rating, reviewsCount, location, targetDogs, isBestRated }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        {isBestRated && (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
            Mejor Valorado
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 font-medium">
        {/* Calificación */}
        <div className="flex items-center text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-900 font-bold">{rating}</span>
          <span className="text-gray-400 font-normal ml-1">({reviewsCount} reseñas)</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>{location}</span>
        </div>

        {/* Tipo de Perro */}
        <div className="flex items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 7.5v.008H12.75V7.5Zm0 2.25v.008H12.75V9.75ZM12.75 12v.008H12.75V12Zm4.5-4.5v.008H17.25V7.5Zm0 2.25v.008H17.25V9.75ZM15 21a3 3 0 1 1-6 0M3 21h1.5V3.545M3 3.545A1.5 1.5 0 0 1 4.5 2h15a1.5 1.5 0 0 1 1.5 1.545M3 3.545v14.18c0 .385.147.756.41 1.033A1.51 1.51 0 0 0 4.5 19.22h15c.398 0 .78-.154 1.066-.431A1.523 1.523 0 0 0 21 17.725V3.545" />
          </svg>
          <span>{targetDogs}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;