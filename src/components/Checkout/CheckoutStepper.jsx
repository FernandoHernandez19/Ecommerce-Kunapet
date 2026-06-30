import React from 'react';
import { Check } from 'lucide-react';

export default function CheckoutStepper({ currentStep = 1, onStepClick }) {
  const steps = [
    { id: 1, label: 'Carrito' },
    { id: 2, label: 'Envío/Reserva' },
    { id: 3, label: 'Pago' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        {/* Línea conectora base */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted && onStepClick;
          
          return (
            <div key={step.id} className="flex flex-col items-center bg-[#FDFDFD] px-4 relative">
              {/* Conector activo condicional */}
              {index > 0 && (isCompleted || isCurrent) && (
                <div className="absolute right-1/2 top-4 w-[200vw] h-1 bg-brand-secondary -z-10 transition-all duration-500 ease-in-out"></div>
              )}
              
              <button 
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                  isCompleted ? 'bg-brand-secondary text-white hover:bg-brand-secondary-hover cursor-pointer' : 
                  isCurrent ? 'bg-brand-secondary-light/30 text-brand-secondary ring-4 ring-brand-secondary/10 cursor-default' : 
                  'bg-gray-100 text-gray-400 cursor-default'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
              </button>
              <span className={`text-xs font-bold mt-3 transition-colors ${
                isCurrent ? 'text-brand-secondary' : 
                isCompleted ? 'text-gray-800' : 'text-gray-400'
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