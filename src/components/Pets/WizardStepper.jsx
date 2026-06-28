import React from 'react';

export default function WizardStepper({ currentStep }) {
  const steps = [
    { id: 1, label: 'Perfil' },
    { id: 2, label: 'Salud' },
    { id: 3, label: 'Fotos' }
  ];

  return (
    <div className="flex items-center justify-center mb-10 w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isCompleted ? 'bg-[#e23d28] text-white' : 
                isCurrent ? 'bg-[#e23d28] text-white ring-4 ring-red-100' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? '✓' : step.id}
              </div>
              <span className={`absolute -bottom-6 text-[11px] font-bold ${isCurrent || isCompleted ? 'text-[#e23d28]' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {/* Línea conectora */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                isCompleted ? 'bg-[#e23d28]' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}