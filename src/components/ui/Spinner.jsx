import React from 'react';

/**
 * Spinner — Indicador de carga circular del Design System KunaPet.
 *
 * @param {'xs'|'sm'|'md'|'lg'} size
 * @param {'current'|'primary'|'white'|'gray'} color
 * @param {string} label  — Texto accesible para screen readers
 */

const SIZES = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

const COLORS = {
  current: 'border-current border-t-transparent',
  primary: 'border-brand-primary border-t-transparent',
  white:   'border-white border-t-transparent',
  gray:    'border-gray-400 border-t-transparent',
};

export default function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Cargando...',
  className = '',
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full animate-spin shrink-0',
        SIZES[size] ?? SIZES.md,
        COLORS[color] ?? COLORS.primary,
        className,
      ].join(' ')}
    />
  );
}
