import React from 'react';

/**
 * Badge — Etiqueta semántica del Design System KunaPet.
 *
 * @param {'primary'|'secondary'|'accent'|'success'|'warning'|'danger'|'info'|'gray'} variant
 * @param {'sm'|'md'} size
 * @param {React.ReactNode} leftIcon — Ícono antes del texto
 */

const VARIANTS = {
  primary:   'bg-brand-primary-light   text-brand-primary   border border-brand-primary/20',
  secondary: 'bg-brand-secondary-light text-brand-secondary border border-brand-secondary/20',
  accent:    'bg-brand-accent-light    text-brand-accent    border border-brand-accent/20',
  success:   'bg-success-light         text-success-text    border border-success/20',
  warning:   'bg-warning-light         text-warning-text    border border-warning/20',
  danger:    'bg-danger-light          text-danger-text     border border-danger/20',
  info:      'bg-info-light            text-info-text       border border-info/20',
  gray:      'bg-gray-100              text-gray-600        border border-gray-200',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs rounded-full',
  md: 'px-2.5 py-1 text-xs rounded-full',
};

export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  leftIcon = null,
  className = '',
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 font-semibold shrink-0',
        VARIANTS[variant] ?? VARIANTS.gray,
        SIZES[size] ?? SIZES.md,
        className,
      ].join(' ')}
    >
      {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
      {children}
    </span>
  );
}
