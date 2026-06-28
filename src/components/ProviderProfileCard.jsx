import React from 'react';

const ProviderProfileCard = ({ provider }) => {
  const handleContact = () => {
    console.log(`Abriendo canal de mensajería con el proveedor: ${provider.id}`);
    // Aquí puedes redirigir al chat interno de KunaPet
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
          <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h3 className="font-bold text-gray-950 text-base">{provider.name}</h3>
            {provider.isVerified && (
              <span className="text-brand-primary" title="Identidad Verificada" aria-label="Verificado">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.11-.049l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium mb-1">{provider.title}</p>
          <div className="flex items-center space-x-3 text-xs text-gray-600 font-semibold">
            <span className="flex items-center">💼 {provider.experience}</span>
            <span className="flex items-center">🐾 {provider.completedWalks}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContact}
        className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.32 19.507a.75.75 0 0 0 1.13.842l2.316-1.543A8.954 8.954 0 0 0 12 20.25Z" />
        </svg>
        <span>Contactar</span>
      </button>
    </div>
  );
};

export default ProviderProfileCard;