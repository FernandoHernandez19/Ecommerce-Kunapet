import React, { useState } from 'react';
import {
  Stethoscope, Scissors, PersonStanding, Home,
} from 'lucide-react';
import { Button } from '../ui';

// ─── Constantes ────────────────────────────────────────────────────────────────
const ACCENT = '#2D6A4F';

const SERVICES = [
  {
    id: 'vet',
    label: 'Veterinaria',
    desc: 'Consultas y cuidados médicos',
    Icon: Stethoscope,
    emoji: '🩺',
  },
  {
    id: 'grooming',
    label: 'Peluquería',
    desc: 'Baño, corte y estética',
    Icon: Scissors,
    emoji: '✂️',
  },
  {
    id: 'walks',
    label: 'Paseos',
    desc: 'Caminatas diarias con tu mascota',
    Icon: PersonStanding,
    emoji: '🦮',
  },
  {
    id: 'daycare',
    label: 'Guardería',
    desc: 'Cuidado durante el día',
    Icon: Home,
    emoji: '🏠',
  },
];

// ─── Toggle estilo iOS ────────────────────────────────────────────────────────
function Toggle({ id, checked, onChange, label, desc }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 py-4 cursor-pointer group"
    >
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2D6A4F] transition-colors">
          {label}
        </p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{desc}</p>
      </div>
      {/* Track */}
      <div className="relative shrink-0">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className="w-12 h-6 rounded-full transition-all duration-300"
          style={{ backgroundColor: checked ? ACCENT : '#D1D5DB' }}
        />
        {/* Thumb */}
        <div
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
          style={{ left: checked ? '26px' : '2px' }}
        />
      </div>
    </label>
  );
}

// ─── Componente Principal: Step 3 ────────────────────────────────────────────
export default function StepClientPreferences({ formData, updateData, onNext, onBack }) {
  const [services, setServices]           = useState(formData.services ?? []);
  const [emailNotif, setEmailNotif]       = useState(formData.emailNotif ?? true);
  const [whatsappNotif, setWhatsappNotif] = useState(formData.whatsappNotif ?? false);
  const [errors, setErrors]               = useState({});

  const toggleService = (id) => {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    const errs = {};
    if (services.length === 0) errs.services = 'Selecciona al menos un servicio de interés.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // Persistir en estado global
    updateData('services',      services);
    updateData('emailNotif',    emailNotif);
    updateData('whatsappNotif', whatsappNotif);
    setErrors({});
    onNext();
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Marca de agua */}
      <div className="absolute -right-6 -top-6 text-[#2D6A4F]/5 pointer-events-none select-none z-0 text-[11rem] leading-none select-none">
        ⭐
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Preferencias</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Personaliza tu experiencia en KunaPet.
          </p>
        </div>

        <div className="flex flex-col gap-10">

          {/* ── SECCIÓN 1: Servicios de Interés ─────────────────────────────── */}
          <section>
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Servicios de Interés{' '}
                <span style={{ color: ACCENT }}>*</span>
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Selecciona todos los que apliquen. Podrás cambiarlos más tarde.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map(({ id, label, desc, Icon, emoji }) => {
                const active = services.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleService(id)}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all ${
                      active ? '' : 'border-gray-100 bg-gray-50/80 hover:border-gray-200'
                    }`}
                    style={
                      active
                        ? { borderColor: ACCENT, backgroundColor: `${ACCENT}0D` }
                        : {}
                    }
                  >
                    {/* Check badge */}
                    {active && (
                      <span
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: ACCENT }}
                      >
                        ✓
                      </span>
                    )}
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <p className={`text-sm font-bold ${active ? '' : 'text-gray-800'}`}
                        style={active ? { color: ACCENT } : {}}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.services && (
              <p role="alert" className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.services}
              </p>
            )}
          </section>

          {/* ── SECCIÓN 2: Preferencias de Contacto ─────────────────────────── */}
          <section>
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900">Preferencias de Contacto</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Elige cómo quieres recibir actualizaciones de KunaPet.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 px-5">
              <Toggle
                id="pref-email"
                label="Notificaciones por correo electrónico"
                desc="Recibe confirmaciones, novedades y ofertas exclusivas."
                checked={emailNotif}
                onChange={setEmailNotif}
              />
              <Toggle
                id="pref-whatsapp"
                label="Recordatorios por WhatsApp"
                desc="Recibe recordatorios de citas y mensajes de tu proveedor."
                checked={whatsappNotif}
                onChange={setWhatsappNotif}
              />
            </div>
          </section>

          {/* ── Navegación global ─────────────────────────────────────────────── */}
          <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            <Button variant="ghost" onClick={onBack}>← Atrás</Button>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<span className="font-bold">→</span>}
              onClick={handleNext}
            >
              Siguiente Paso
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
