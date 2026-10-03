import React from 'react';

const PROVIDER_STEPS = [
  { id: 1, label: 'Perfil' },
  { id: 2, label: 'Servicios' },
  { id: 3, label: 'Verificación' },
  { id: 4, label: 'Éxito' },
];

/**
 * RegistrationStepper — Stepper reutilizable para flujos de registro.
 *
 * @param {number}   currentStep  — Paso activo (1-based)
 * @param {Array}    steps        — Array de {id, label}. Por defecto usa los del Proveedor.
 * @param {string}   accentColor  — Color activo/completado. Por defecto rojo Provider.
 * @param {string}   ringColor    — Clase Tailwind para el ring del step activo.
 * @param {string}   bgColor      — Color de fondo del stepper (debe coincidir con el fondo).
 */
export default function RegistrationStepper({
  currentStep,
  steps = PROVIDER_STEPS,
  accentColor = '#e23d28',
  ringColor = 'ring-red-50',
  bgColor = '#FAFAFA',
}) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 -z-10"></div>

        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center px-2 relative z-10"
              style={{ backgroundColor: bgColor }}
            >
              {/* Línea de progreso */}
              {index > 0 && (isActive || isCompleted) && (
                <div
                  className="absolute right-1/2 top-5 w-[100vw] sm:w-[200px] h-0.5 -z-10"
                  style={{ backgroundColor: accentColor }}
                />
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                  isActive
                    ? `ring-4 ${ringColor} text-white`
                    : isCompleted
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
                style={
                  isActive || isCompleted
                    ? { backgroundColor: accentColor }
                    : {}
                }
              >
                {isCompleted ? '✓' : step.id}
              </div>

              <span
                className="text-xs font-bold mt-3"
                style={
                  isActive || isCompleted
                    ? { color: accentColor }
                    : { color: '#9ca3af' }
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}