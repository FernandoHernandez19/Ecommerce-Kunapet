import React, { useState } from 'react';

/**
 * Avatar — Imagen de perfil con fallback del Design System KunaPet.
 *
 * Si la imagen falla al cargar, muestra las iniciales del nombre
 * sobre un fondo de color generado a partir del nombre.
 *
 * @param {string} src       — URL de la imagen
 * @param {string} name      — Nombre completo (para iniciales y alt)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @param {boolean} online   — Muestra indicador de estado online
 */

const SIZES = {
  xs: { container: 'w-6 h-6',   text: 'text-[9px]',  dot: 'w-1.5 h-1.5' },
  sm: { container: 'w-8 h-8',   text: 'text-xs',     dot: 'w-2 h-2' },
  md: { container: 'w-10 h-10', text: 'text-sm',     dot: 'w-2.5 h-2.5' },
  lg: { container: 'w-14 h-14', text: 'text-base',   dot: 'w-3 h-3' },
  xl: { container: 'w-20 h-20', text: 'text-xl',     dot: 'w-3.5 h-3.5' },
};

// Genera un color de fondo determinístico a partir del nombre
function getInitialsColor(name = '') {
  const colors = [
    'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500',
    'bg-teal-500', 'bg-blue-500',  'bg-violet-500', 'bg-pink-500',
  ];
  const index = (name.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Avatar({
  src,
  name = '',
  size = 'md',
  online = false,
  className = '',
}) {
  const [imgError, setImgError] = useState(false);
  const s = SIZES[size] ?? SIZES.md;
  const showFallback = !src || imgError;

  return (
    <div className={['relative inline-block shrink-0', className].join(' ')}>
      <div
        className={[
          s.container,
          'rounded-full overflow-hidden select-none',
          showFallback
            ? `${getInitialsColor(name)} flex items-center justify-center`
            : 'border border-surface-border',
        ].join(' ')}
        aria-label={name || 'Avatar'}
      >
        {showFallback ? (
          <span className={['font-bold text-white', s.text].join(' ')}>
            {getInitials(name)}
          </span>
        ) : (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Online indicator */}
      {online && (
        <span
          aria-label="En línea"
          className={[
            s.dot,
            'absolute bottom-0 right-0 rounded-full',
            'bg-success border-2 border-white',
          ].join(' ')}
        />
      )}
    </div>
  );
}
