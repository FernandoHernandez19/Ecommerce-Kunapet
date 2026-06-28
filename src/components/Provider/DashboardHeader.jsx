/**
 * DashboardHeader — Encabezado de bienvenida reutilizable para dashboards.
 *
 * Muestra: saludo personalizado, subtítulo con info contextual y
 * una acción primaria opcional (CTA button).
 *
 * Props:
 *  @param {string}          title       — Título principal (ej: "¡Hola, Camila!")
 *  @param {string}          subtitle    — Línea de contexto (ej: "Tienes 2 citas hoy")
 *  @param {React.ReactNode} action      — Botón o acción a la derecha
 *  @param {string}          className   — Clases adicionales
 */

import React from 'react';

export default function DashboardHeader({
  title,
  subtitle,
  action,
  className = '',
}) {
  return (
    <header
      className={[
        'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8',
        className,
      ].join(' ')}
    >
      {/* Textos */}
      <div>
        {title && (
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed max-w-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Acción opcional */}
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}
