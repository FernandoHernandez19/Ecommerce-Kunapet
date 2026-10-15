
/**
 * Spinner — Indicador de carga circular del Design System KunaPet.
 *
 * @param {'xs'|'sm'|'md'|'lg'} size
 * @param {'current'|'primary'|'white'|'gray'} color
 * @param {string} label  — Texto accesible para screen readers
 */

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'current' | 'primary' | 'white' | 'gray';

const SIZES: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

const COLORS: Record<SpinnerColor, string> = {
  current: 'border-current border-t-transparent',
  primary: 'border-brand-primary border-t-transparent',
  white:   'border-white border-t-transparent',
  gray:    'border-gray-400 border-t-transparent',
};

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Cargando...',
  className = '',
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full animate-spin shrink-0',
        SIZES[size],
        COLORS[color],
        className,
      ].join(' ')}
    />
  );
}
