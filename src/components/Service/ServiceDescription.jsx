import React from 'react';

// Mapeador de iconos de características para evitar lógica compleja en el render
const getFeatureIcon = (type) => {
  switch (type) {
    case 'duration':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case 'activity':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case 'insurance':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" />
        </svg>
      );
    case 'report':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
      );
    default:
      return null;
  }
};

const ServiceDescription = ({ description, extraInfo, features }) => {
  return (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Acerca de este servicio</h2>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
        {extraInfo && <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium">{extraInfo}</p>}
      </div>

      {/* Grid de Características */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-xl text-center space-y-2 hover:bg-white hover:shadow-sm transition-all"
          >
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-50">
              {getFeatureIcon(feature.type)}
            </div>
            <span className="text-xs font-semibold text-gray-800">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDescription;