import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Datos de slides — movidos fuera del componente (son estáticos) ───────────
// Al estar fuera, la referencia no cambia en re-renders → el useEffect es estable
const SLIDES = [
  {
    id:       1,
    title:    'Veterinarias Confiables',
    subtitle: 'Encuentra los mejores especialistas para tu peludo',
    color:    '#f05a28',
    icon:     '🏥',
    cta:      'Ver veterinarias',
    href:     '/marketplace?category=Veterinaria',
  },
  {
    id:       2,
    title:    'Grooming Premium',
    subtitle: 'Servicios de higiene y estética de calidad',
    color:    '#e0b020',
    icon:     '✨',
    cta:      'Ver grooming',
    href:     '/marketplace?category=Grooming',
  },
  {
    id:       3,
    title:    'Paseos y Cuidados',
    subtitle: 'Diversión y bienestar para tus mascotas',
    color:    '#059669',
    icon:     '🚶',
    cta:      'Ver paseos',
    href:     '/marketplace?category=Paseos',
  },
  {
    id:       4,
    title:    'Membresías Exclusivas',
    subtitle: 'Acceso a beneficios especiales todo el año',
    color:    '#e23d28',
    icon:     '👑',
    cta:      'Ver membresías',
    href:     '/marketplace',
  },
];

const TOTAL = SLIDES.length;
const INTERVAL_MS = 5000;

export default function CarouselBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused,    setIsPaused]    = useState(false);

  // M5 FIX: slides es estática fuera del componente → no cambia entre renders
  // La dependencia correcta es [] (sin deps) porque el intervalo se reinicia
  // al desmontar el componente con el cleanup function.
  const next = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % TOTAL),
    []
  );
  const prev = useCallback(
    () => setActiveIndex((prev) => (prev - 1 + TOTAL) % TOTAL),
    []
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isPaused, next]); // ✅ FIX M5: deps correctas y estables

  const slide = SLIDES[activeIndex];

  return (
    <section
      className="carousel-banner relative w-full overflow-hidden"
      aria-label="Banner principal KunaPet"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Slide principal ── */}
      <div
        className="carousel-content flex items-center justify-center w-full transition-all duration-500"
        style={{
          background:  `linear-gradient(135deg, ${slide.color}, ${slide.color}cc)`,
          minHeight:   '400px',
        }}
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${activeIndex + 1} de ${TOTAL}: ${slide.title}`}
      >
        <div className="text-center text-white px-6 max-w-2xl mx-auto">
          {/* Ícono animado */}
          <div
            className="carousel-icon mb-4"
            style={{ fontSize: '4rem' }}
            aria-hidden="true"
          >
            {slide.icon}
          </div>

          {/* Título */}
          <h2 className="carousel-title font-black mb-3">
            {slide.title}
          </h2>

          {/* Subtítulo */}
          <p className="carousel-subtitle text-lg mb-6">
            {slide.subtitle}
          </p>

          {/* CTA */}
          <Link
            to={slide.href}
            className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-pill text-base hover:bg-gray-100 transition-all hover:scale-105 no-underline shadow-lg"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* ── Controles ── */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="carousel-control-prev absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/30 hover:bg-white/60 rounded-full flex items-center justify-center transition z-10 text-white"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente slide"
        className="carousel-control-next absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/30 hover:bg-white/60 rounded-full flex items-center justify-center transition z-10 text-white"
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>

      {/* ── Indicadores ── */}
      <div
        className="carousel-indicators flex justify-center gap-3 py-4 pb-6"
        role="tablist"
        aria-label="Slides del carousel"
      >
        {SLIDES.map((s, index) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Ir al slide ${index + 1}: ${s.title}`}
            onClick={() => setActiveIndex(index)}
            className={[
              'indicator-dot w-3 h-3 rounded-full transition-all duration-300',
              index === activeIndex
                ? 'active bg-white shadow-md scale-125'
                : 'bg-white/50 hover:bg-white/75',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  );
}
