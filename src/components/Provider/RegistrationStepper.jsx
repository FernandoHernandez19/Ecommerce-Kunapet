import React from 'react';

export default function RegistrationStepper({ currentStep }) {
  const steps = [
    { id: 1, label: 'Perfil' },
    { id: 2, label: 'Servicios' },
    { id: 3, label: 'Verificación' },
    { id: 4, label: 'Éxito' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 -z-10"></div>
        
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center bg-[#FAFAFA] px-2 relative z-10">
              {/* Línea verde de progreso */}
              {index > 0 && (isActive || isCompleted) && (
                <div className="absolute right-1/2 top-5 w-[100vw] sm:w-[200px] h-0.5 bg-[#e23d28] -z-10"></div>
              )}

              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                isActive ? 'bg-[#e23d28] text-white ring-4 ring-red-50' : 
                isCompleted ? 'bg-[#e23d28] text-white' : 
                'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                {isCompleted ? '✓' : step.id}
              </div>
              <span className={`text-xs font-bold mt-3 ${isActive || isCompleted ? 'text-[#e23d28]' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}