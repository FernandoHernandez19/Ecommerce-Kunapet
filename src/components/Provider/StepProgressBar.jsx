import React from 'react';

export default function StepProgressBar({ currentStep }) {
  // Textos 100% en español para mantener consistencia UI/UX
  const steps = [
    { id: 1, label: 'Perfil' },
    { id: 2, label: 'Servicios' },
    { id: 3, label: 'Verificación' },
    { id: 4, label: 'Éxito' }
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        
        {/* Línea gris de fondo (Pendiente) */}
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 -z-10"></div>
        
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center bg-[#F8F9FA] px-2 relative z-10">
              
              {/* Línea verde conectora (Completado) */}
              {index > 0 && (isActive || isCompleted) && (
                <div className="absolute right-1/2 top-5 w-[50vw] sm:w-[150px] h-0.5 bg-[#e23d28] -z-10 transition-all duration-500 ease-in-out"></div>
              )}

              {/* Círculo del Stepper */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm ${
                isActive ? 'bg-[#e23d28] text-white ring-4 ring-red-100' : 
                isCompleted ? 'bg-[#e23d28] text-white' : 
                'bg-white text-gray-400 border-2 border-gray-200'
              }`}>
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" /></svg>
                ) : (
                  step.id
                )}
              </div>
              
              {/* Etiqueta de texto */}
              <span className={`text-xs font-bold mt-3 transition-colors duration-300 ${
                isActive ? 'text-[#e23d28]' : 
                isCompleted ? 'text-gray-800' : 
                'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}