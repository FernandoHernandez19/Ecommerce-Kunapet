import React from 'react';
import Spinner from './Spinner';

/**
 * Button — Componente atómico del Design System KunaPet.
 *
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} isLoading   — Muestra spinner y deshabilita el botón
 * @param {boolean} fullWidth   — Ocupa el 100% del contenedor
 * @param {React.ReactNode} leftIcon  — Ícono a la izquierda del texto
 * @param {React.ReactNode} rightIcon — Ícono a la derecha del texto
 */

const VARIANTS = {
  primary: [
    'bg-brand-primary text-white',
    'hover:bg-brand-primary-hover',
    'shadow-brand-sm hover:shadow-brand',
    'focus-visible:ring-brand-primary',
    'disabled:bg-brand-primary/50',
  ].join(' '),

  secondary: [
    'bg-brand-secondary text-white',
    'hover:bg-brand-secondary-hover',
    'shadow-emerald hover:shadow-emerald',
    'focus-visible:ring-brand-secondary',
    'disabled:bg-brand-secondary/50',
  ].join(' '),

  outline: [
    'bg-transparent text-brand-primary',
    'border-2 border-brand-primary',
    'hover:bg-brand-primary-light',
    'focus-visible:ring-brand-primary',
    'disabled:opacity-50',
  ].join(' '),

  ghost: [
    'bg-transparent text-gray-600',
    'hover:bg-gray-100 hover:text-gray-900',
    'focus-visible:ring-gray-400',
    'disabled:opacity-50',
  ].join(' '),

  danger: [
    'bg-danger text-white',
    'hover:bg-danger-text',
    'focus-visible:ring-danger',
    'disabled:opacity-50',
  ].join(' '),
};

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-2xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        // Base
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200 active:scale-[0.97]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:active:scale-100',
        // Variante
        VARIANTS[variant] ?? VARIANTS.primary,
        // Tamaño
        SIZES[size] ?? SIZES.md,
        // Full width
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading ? (
        <Spinner size={size === 'sm' ? 'xs' : 'sm'} color="current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
