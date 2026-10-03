import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui';

const ACCENT = '#2D6A4F';

const SERVICE_LABELS = {
  vet:      'Veterinaria',
  grooming: 'Peluquería',
  walks:    'Paseos',
  daycare:  'Guardería',
};
const SERVICE_EMOJIS = { vet: '🩺', grooming: '✂️', walks: '🦮', daycare: '🏠' };

export default function StepClientSuccess({ formData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // Animación de entrada
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const validPets = (formData.pets ?? []).filter((p) => p.name?.trim());
  const firstName = formData.fullName?.trim().split(' ')[0] ?? '';

  const handleFinish = () => {
    // Aquí iría el POST real; por ahora simulamos y redirigimos
    console.log('[KunaPet] formData final →', formData);
    navigate('/clientdashboard');
  };

  return (
    <div
      className={`bg-white rounded-[2rem] p-8 md:p-14 shadow-sm border border-gray-100
        flex flex-col items-center text-center gap-8 transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {/* ── Ícono de éxito animado ───────────────────────────────────────────── */}
      <div className="relative">
        {/* Anillos concéntricos */}
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${ACCENT}15` }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}25` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              <CheckCircle2 size={28} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        {/* Patas flotantes decorativas */}
        <PawPrint
          size={22}
          className="absolute -top-2 -right-3 animate-bounce"
          style={{ color: ACCENT, opacity: 0.5 }}
        />
        <PawPrint
          size={14}
          className="absolute -bottom-1 -left-4 opacity-30"
          style={{ color: ACCENT }}
        />
      </div>

      {/* ── Mensaje de bienvenida ────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          ¡Bienvenido a KunaPet{firstName ? `, ${firstName}` : ''}! 🎉
        </h2>
        <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
          Tu perfil ha sido creado con éxito. Ya puedes explorar los mejores
          proveedores de servicios para tus mascotas.
        </p>
      </div>

      {/* ── Resumen del registro ─────────────────────────────────────────────── */}
      <div
        className="w-full max-w-sm rounded-2xl p-5 text-left flex flex-col gap-3.5"
        style={{ backgroundColor: `${ACCENT}0A` }}
      >
        {formData.fullName && (
          <SummaryRow emoji="👤" label="Nombre" value={formData.fullName} />
        )}
        {formData.city && (
          <SummaryRow emoji="📍" label="Ciudad" value={formData.city} />
        )}
        {validPets.length > 0 && (
          <SummaryRow
            emoji="🐾"
            label="Mascotas"
            value={validPets.map((p) => p.name).join(', ')}
          />
        )}
        {(formData.services ?? []).length > 0 && (
          <SummaryRow
            emoji="⭐"
            label="Servicios de interés"
            value={(formData.services ?? [])
              .map((s) => `${SERVICE_EMOJIS[s] ?? ''} ${SERVICE_LABELS[s] ?? s}`)
              .join('  ·  ')}
          />
        )}
      </div>

      {/* ── Botón de acción principal ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          id="btn-finish-registration"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleFinish}
        >
          Finalizar y ver mi panel
        </Button>
        <Button
          id="btn-go-marketplace"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => navigate('/marketplace')}
        >
          Explorar Marketplace
        </Button>
      </div>
    </div>
  );
}

// ─── Fila de resumen ──────────────────────────────────────────────────────────
function SummaryRow({ emoji, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
