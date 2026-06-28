import React, { useRef } from 'react';

export default function DocumentUploadCard({ id, title, description, isRequired, icon, file, onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileUpload(id, selectedFile);
    }
  };

  const isUploaded = file !== null;

  return (
    <div className={`bg-white rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md ${isUploaded ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200'}`}>
      
      {/* Información del Documento */}
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {isRequired ? (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Requerido</span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Opcional</span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
      </div>

      {/* Estados y Acciones */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-50">
        
        {/* Etiqueta de Estado */}
        {isUploaded ? (
          <div className="flex items-center space-x-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 max-w-[150px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-600 flex-shrink-0"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.11-.049l3.75-5.25Z" clipRule="evenodd" /></svg>
            <span className="text-xs font-bold text-emerald-700 truncate" title={file.name}>{file.name}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="text-gray-400">⋯</span>
            <span className="text-xs font-bold text-gray-500">Pendiente</span>
          </div>
        )}

        {/* Input Oculto y Botón */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <button 
          onClick={handleButtonClick}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-xl text-sm font-bold transition-colors ${
            isUploaded 
              ? 'border-gray-200 text-gray-600 hover:bg-gray-50' 
              : 'border-[#006D44] text-[#006D44] hover:bg-emerald-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          <span>{isUploaded ? 'Reemplazar' : 'Subir archivo'}</span>
        </button>
      </div>
    </div>
  );
}