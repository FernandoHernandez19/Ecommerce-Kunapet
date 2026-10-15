import React from 'react';

/** Etiqueta visible para secciones que todavía muestran datos de ejemplo (la API aún no las ofrece). */
export default function ExampleDataBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 ${className}`}
    >
      Datos de ejemplo
    </span>
  );
}
