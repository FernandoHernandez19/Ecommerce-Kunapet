import React from 'react';

export default function CheckoutStepper() {
  const steps = [
    { id: 1, label: 'Carrito', status: 'completed' },
    { id: 2, label: 'Envío/Reserva', status: 'completed' },
    { id: 3, label: 'Pago', status: 'current' },
    { id: 4, label: 'Confirmación', status: 'pending' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Línea conectora */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
        
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          
          return (
            <div key={step.id} className="flex flex-col items-center bg-[#FDFDFD] px-2 relative">
              {/* Conector verde condicional */}
              {index > 0 && (isCompleted || isCurrent) && (
                <div className="absolute right-1/2 top-4 w-[200vw] h-0.5 bg-[#006D44] -z-10"></div>
              )}
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all ${
                isCompleted ? 'bg-[#006D44] text-white' : 
                isCurrent ? 'bg-emerald-200 text-[#006D44] ring-4 ring-emerald-50' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {isCompleted ? '✓' : isCurrent ? '🐾' : step.id}
              </div>
              <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-[#006D44]' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}